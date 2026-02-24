export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const convertToDate = (timestamp) => {
  if (!timestamp) return "";
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

export const formatWei = (value) => {
  if (!value) return "0";
  return (BigInt(value) / BigInt(10) ** BigInt(18)).toString();
};

export const convertAreaSquareMeters = (area) => {
  if (!area) return "0";
  return Number(area).toLocaleString();
};

export const sanitizeInput = (input) => {
  return input.trim();
};

export const validateLocation = (location) => {
  return location.length > 0 && location.length <= 500;
};

export const validatePropertyNumber = (number) => {
  return number.length > 0 && number.length <= 100;
};

export const validateArea = (area) => {
  const num = Number(area);
  return num > 0;
};

export const validateOwnerName = (name) => {
  return name.length > 0 && name.length <= 200;
};

export const validateContactInfo = (contact) => {
  return contact.length > 0 && contact.length <= 200;
};

export const validateCoordinates = (coordinates) => {
  const parts = coordinates.split(",");
  if (parts.length !== 2) return false;
  
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const validateIPFSHash = (hash) => {
  return hash.length > 0 && hash.startsWith("Qm");
};
