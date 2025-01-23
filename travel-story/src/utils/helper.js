export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name || typeof name !== "string") {
        return "";
    }
    const words = name.trim().split(/\s+/); // Trim and split by 1 or more spaces
    let initials = words.slice(0, 2) // Get up to 2 words
                         .map(word => word[0].toUpperCase()) // Take the first letter of each word
                         .join(""); // Join the letters to form initials
    return initials;
};