import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, PhoneOff, User, Settings, Shield } from 'lucide-react';
import webrtcService from '../services/webrtc.service';
import authService from '../services/auth.service';
import appointmentService from '../services/appointment.service';
import toast from 'react-hot-toast';

export default function VideoConsultation() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const appointmentId = new URLSearchParams(location.search).get('appointmentId');
    const user = authService.getCurrentUser();
    const userId = user?._id || user?.id;

    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [callEnded, setCallEnded] = useState(false);
    const [doctorName, setDoctorName] = useState('Remote Participant');

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const streamRef = useRef(null);

    useEffect(() => {
        if (!userId || !roomId) {
            navigate('/login');
            return;
        }

        const fetchAppointmentDetails = async () => {
            if (appointmentId) {
                try {
                    const response = await appointmentService.getAppointmentById(appointmentId);
                    const appointment = response?.data;

                    if (appointment) {
                        let name = user.role === 'doctor'
                            ? (appointment.userId?.name?.first || appointment.userId?.name || 'Patient')
                            : (appointment.doctorId?.name || 'Doctor');

                        if (user.role === 'patient' && name !== 'Doctor' && !name.toLowerCase().startsWith('dr.')) {
                            name = `Dr. ${name}`;
                        }
                        setDoctorName(name);
                    }
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                }
            }
        };

        fetchAppointmentDetails();
    }, [appointmentId, userId, roomId, navigate]);

    useEffect(() => {
        if (!userId || !roomId) return;

        let mounted = true;

        const initCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (!mounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                setLocalStream(stream);
                streamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                webrtcService.connect(userId);
                webrtcService.joinRoom(roomId, appointmentId, userId);

                webrtcService.onUserJoined(({ userId: joinedUserId }) => {
                    console.log('Other user joined:', joinedUserId);
                    webrtcService.initializePeer(
                        true,
                        stream,
                        (offer) => webrtcService.emitOffer(roomId, offer),
                        (rStream) => {
                            setRemoteStream(rStream);
                            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = rStream;
                            setIsConnecting(false);
                        },
                        handleCallEnd
                    );
                });

                webrtcService.onOffer(({ offer }) => {
                    console.log('Received offer');
                    webrtcService.initializePeer(
                        false,
                        stream,
                        (answer) => webrtcService.emitAnswer(roomId, answer),
                        (rStream) => {
                            setRemoteStream(rStream);
                            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = rStream;
                            setIsConnecting(false);
                        },
                        handleCallEnd
                    );
                    webrtcService.signal(offer);
                });

                webrtcService.onAnswer(({ answer }) => {
                    console.log('Received answer');
                    webrtcService.signal(answer);
                });

                webrtcService.onUserLeft(() => {
                    setRemoteStream(null);
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
                    toast.error('The other party has left the consultation');
                });

            } catch (error) {
                console.error('Error accessing media devices:', error);
                toast.error('Could not access camera/microphone. Please check permissions.');
                setIsConnecting(false);
            }
        };

        initCall();

        return () => {
            mounted = false;
            webrtcService.removeListeners();

            // Comprehensive cleanup using ref to avoid closure issues
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            setLocalStream(null);
            webrtcService.leaveRoom(roomId, userId);
            webrtcService.disconnect();
        };
    }, [roomId, userId, appointmentId, navigate]);

    const handleCallEnd = () => {
        setCallEnded(true);

        // Stop all tracks in the local stream explicitly
        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop();
                console.log(`Stopped track: ${track.kind}`);
            });
        }

        // Stop remote tracks as well if they exist
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }

        webrtcService.leaveRoom(roomId, userId);
        webrtcService.disconnect();

        toast.success('Consultation ended');
        navigate('/appointments');
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    <div>
                        <h2 className="font-bold text-lg">Secure Consultation</h2>
                        <p className="text-xs text-gray-400">Room ID: {roomId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-xs font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active Session
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 relative p-4 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr max-h-[calc(100vh-160px)]">
                {/* Remote Video (Doctor/Patient) */}
                <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
                    {remoteStream ? (
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                <User className="w-10 h-10 text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">
                                {isConnecting ? 'Establishing secure connection...' : 'Waiting for the other person to join...'}
                            </p>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium border border-white/10 uppercase tracking-wider">
                        {doctorName}
                    </div>
                </div>

                {/* Local Video */}
                <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                                <VideoOff className="w-10 h-10 text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">Your camera is off</p>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-medium border border-white/10 uppercase tracking-wider">
                        You {isMuted && '(Muted)'}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 border-t border-gray-700 flex items-center justify-center gap-4 sm:gap-8">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full transition-all duration-300 shadow-lg ${isMuted ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={handleCallEnd}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 shadow-xl transform scale-110 active:scale-95 flex items-center gap-2 px-6"
                    title="End Consultation"
                >
                    <PhoneOff className="w-6 h-6" />
                    <span className="hidden sm:inline font-bold">End Call</span>
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full transition-all duration-300 shadow-lg ${isVideoOff ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                    title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>
            </div>
        </div>
    );
}
