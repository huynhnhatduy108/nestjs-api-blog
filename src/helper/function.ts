const bcrypt = require("bcrypt")

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


  function getDifference(setA, setB) {
    return new Set(
      [...setA].filter(element => !setB.has(element))
    );
  }
  

export function compareOldToNewList(newList, oldList) {
  // Convert lists to sets to compare them more easily
  const newSet = new Set(newList.map(String));
  const oldSet = new Set(oldList.map(String));

  const listAdd = [...newSet].filter(item => !oldSet.has(item));
  const listDelete = [...oldSet].filter(item => !newSet.has(item));

  // Check if the two sets are equal
  if (!listAdd.length && !listDelete.length) {
    return {
      isEqual: true,
      listAdd: [],
      listDelete: []
    };
  } else {
    // Get the lists of elements that are in the new list but not in the old list, and vice versa
    const listAdd = [...newSet].filter(item => !oldSet.has(item));
    const listDelete = [...oldSet].filter(item => !newSet.has(item));

    return {
      isEqual: false,
      listAdd: listAdd,
      listDelete: listDelete
    };
  }
}

export async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash
  // Store hash in the database
}

export async function comparePassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}
