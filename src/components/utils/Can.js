const can = (arr,permission) => (arr || []).find((p) => p==permission) ? true :false;

export default can;