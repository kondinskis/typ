export class LocalStorageUtil {

	public static getItem(key) { 
		const value = localStorage.getItem(key);
		if (!value || value == 'null') {
			return null;
		}
		return value;
	}

	public static setItem(key, value) {
		localStorage.setItem(key, value);
	}

	public static clear() {
		localStorage.clear();
	}

}
