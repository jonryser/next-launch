export const removeProtocol = (stringToClean: string) => {
	if (!stringToClean) {
		return ``
	}
	return stringToClean.replace(/^\/\/|^.*?:(\/\/)?/, ``).replace(/^\//, ``)
}

export const removeProtocolOrSlash = (stringToClean: string) => {
	return removeProtocol(stringToClean).replace(/^\//, ``)
}
