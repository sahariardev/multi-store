export enum StoreType {
  SYSTEM,
  MULTISTORE,
  REGULAR   
}

export const isValidStoreType = (storeType : string):boolean => {
    const storeTypes:string[] = Object.keys(StoreType).filter((item) => {
        return isNaN(Number(item));
    });

    return storeTypes.includes(storeType);
}