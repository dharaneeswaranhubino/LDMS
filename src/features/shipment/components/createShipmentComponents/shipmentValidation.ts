import type { Address, PackageDetails } from "../../shipmentTypes";

export const validateShipmentAddress = (
  pickUpAddress: Address,
  deliveryAddress: Address,
) => {
  const errors: Record<string, string> = {};

  if(!pickUpAddress.name.trim()){
    errors.pickUpName = "Sender Name is required"
  }

  if(!pickUpAddress.phone){
    errors.pickUpPhone = "Sender Phone is required"
  }

  if (!pickUpAddress.fullAddress.trim()) {
    errors.pickUpFullAddress = "PickUp full address is required";
  }else if(pickUpAddress.fullAddress.length <5){
    errors.pickUpFullAddress = "please enter atleast 5 letters"
  }

  if (!pickUpAddress.city.trim()) {
    errors.pickUpCity = "PickUp City is required";
  }else if(pickUpAddress.city.length <2){
    errors.pickUpCity = "please enter atleast 2 letters"
  }

  if (!pickUpAddress.pinCode.trim()) {
    errors.pickUpPinCode = "PickUp pinCode is required";
  } else if (!/^\d+$/.test(pickUpAddress.pinCode)) {
    errors.pickUpPinCode = "Please enter numbers only";
  } else if (!/^[0-9]{6}$/.test(pickUpAddress.pinCode)) {
    errors.pickUpPinCode = "PickUp pinCode must be 6 digits";
  }


  if(!deliveryAddress.name.trim()){
    errors.deliveryName = "Receiver Name is required"
  }

  if(!deliveryAddress.phone){
    errors.deliveryPhone = "Receiver Phone is required"
  }

  if (!deliveryAddress.fullAddress.trim()) {
    errors.deliveryFullAddress = "Delivery full address is required";
  }else if(deliveryAddress.fullAddress.length <5){
    errors.deliveryFullAddress = "please enter atleast 5 letters"
  }

  if (!deliveryAddress.city.trim()) {
    errors.deliveryCity = "Delivery city is required";
  }else if(deliveryAddress.city.length <2){
    errors.deliveryCity = "please enter atleast 2 letters"
  }

  if (!deliveryAddress.pinCode.trim()) {
    errors.deliveryPinCode = "Delivery pincode is required";
  } else if (!/^\d+$/.test(pickUpAddress.pinCode)) {
    errors.deliveryPinCode = "Please enter numbers only";
  } else if (!/^[0-9]{6}$/.test(deliveryAddress.pinCode)) {
    errors.deliveryPinCode = "Delivery pinCode must be 6 digits";
  }

  return errors;
};

export const validatePackageDetails = (packageDetails: PackageDetails) => {
  const errors: Record<string, string> = {};

  if (!packageDetails.itemName.trim()) {
    errors.itemName = "Item name is required";
  }

  if (!packageDetails.quantity.trim()) {
    errors.quantity = "Quantity is required";
  } else if (Number(packageDetails.quantity) <= 0) {
    errors.quantity = "Quantity must be greater than 0";
  } else if (!/^\d+$/.test(packageDetails.quantity)) {
    errors.quantity = "Please enter numbers only";
  }

  if (!packageDetails.weight.trim()) {
    errors.weight = "Weight is required";
  } else if (Number(packageDetails.weight) <= 0) {
    errors.weight = "Weight must be greater than 0";
  } else if (!/^\d+$/.test(packageDetails.weight)) {
    errors.weight = "Please enter numbers only";
  }

  // if(packageDetails.fragile !== true || packageDetails.fragile !== false){
  //   errors.fragile = "fragile is required"
  // }

  return errors;
};
