/**
 * Check if a user profile is complete
 * Essential fields for completion:
 * - bloodGroup
 * - height
 * - weight
 * - location
 * - emergencyContact (name, phone, relation)
 * - dateOfBirth
 * - gender
 * @param {Object} user - The user object to check
 * @returns {boolean} - True if complete, false otherwise
 */
export const isProfileComplete = (user) => {
    if (!user) return false;

    const essentialFields = [
        'bloodGroup',
        'height',
        'weight',
        'location',
        'dateOfBirth',
        'gender'
    ];

    // Check top level essential fields
    for (const field of essentialFields) {
        if (!user[field]) return false;
    }

    // Check emergency contact
    if (!user.emergencyContact || 
        !user.emergencyContact.name || 
        !user.emergencyContact.phone || 
        !user.emergencyContact.relation) {
        return false;
    }

    return true;
};
