/**
 * تحويل البيانات إلى plain objects لتجنب مشاكل Next.js
 */

export function serializeData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString() as T;
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeData(item)) as T;
  }

  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeData(value);
    }
    return serialized as T;
  }

  return data;
}

/**
 * تحويل البيانات من API إلى plain objects
 */
export function sanitizeApiResponse<T>(response: any): T {
  if (!response) return response;
  
  // إذا كان response يحتوي على data property
  if (response.data) {
    return {
      ...response,
      data: serializeData(response.data)
    } as T;
  }
  
  // إذا كان response نفسه هو البيانات
  return serializeData(response) as T;
}

/**
 * تحويل التواريخ في الكائن إلى strings
 */
export function convertDatesToStrings<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (obj instanceof Date) {
    return obj.toISOString() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertDatesToStrings(item)) as T;
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        converted[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        converted[key] = convertDatesToStrings(value);
      } else {
        converted[key] = value;
      }
    }
    return converted as T;
  }

  return obj;
} 