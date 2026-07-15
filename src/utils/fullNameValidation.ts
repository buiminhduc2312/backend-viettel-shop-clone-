export const FULL_NAME_ERROR_MESSAGE = 'Vui lòng nhập họ và tên hợp lệ.';

const VIETNAMESE_LETTER_PATTERN = /^[A-Za-zÀ-ỹ\s]+$/u;

export const isValidFullName = (value: string) => {
    const normalizedValue = value.trim();

    if (normalizedValue.length < 2 || normalizedValue.length > 50) return false;
    if (!VIETNAMESE_LETTER_PATTERN.test(normalizedValue)) return false;
    if (/\s{2,}/.test(normalizedValue)) return false;

    const words = normalizedValue.split(' ');
    if (words.length === 1 && normalizedValue.length > 20) return false;
    if (/([A-Za-zÀ-ỹ])\1{4,}/u.test(normalizedValue)) return false;
    if (!/[aeiouyàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/iu.test(normalizedValue)) {
        return false;
    }

    return true;
};
