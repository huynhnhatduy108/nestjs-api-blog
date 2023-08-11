

export function stringToSlug(text: string) {
  if (!text) return '';
  return text
    .toLowerCase() // Convert the text to lowercase
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters (excluding hyphens)
    .replace(/--+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove hyphens from the beginning and end of the slug
}

export function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    
    return randomString;
}

export function generateSlugAndRandomString(text: string, length:number =0) {
    if (!text) return '';
    const str = stringToSlug(text) + generateRandomString(length)
    return str;
}


export function convertStringToObjectOrdering(text: string) {
    if (!text) return {}
    const fields = text.split(',');
    const obj = {};
  
    fields.forEach(field => {
      const [key, value] = field.split(':');
      obj[key] = value === '1' ? 1 : -1; 
    });
  
    return obj;
  }
  



