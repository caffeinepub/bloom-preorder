import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  type OldPreorder = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Int;
  };

  type OldActor = {
    preorders : Map.Map<Principal, OldPreorder>;
  };

  type NewPreorder = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Int;
  };

  type NewActor = {
    preorders : Map.Map<Nat, NewPreorder>;
    orderIdCounter : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPreorders = Map.empty<Nat, NewPreorder>();
    { preorders = newPreorders; orderIdCounter = 0 };
  };
};
