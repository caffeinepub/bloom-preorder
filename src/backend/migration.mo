import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  type Preorder = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Time.Time;
  };

  type OldActor = {
    var orderIdCounter : Nat;
    preorders : Map.Map<Nat, Preorder>;
  };

  type NewActor = {
    orderIdCounter : Nat;
    preorders : Map.Map<Nat, Preorder>;
  };

  public func run(old : OldActor) : NewActor {
    {
      orderIdCounter = old.orderIdCounter;
      preorders = old.preorders;
    };
  };
};
