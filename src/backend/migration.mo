import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type Address = {
    street : Text;
    city : Text;
    state : Text;
    pincode : Text;
  };

  type OldPreorder = {
    name : Text;
    email : Text;
    quantity : Nat;
  };

  type OldActor = {
    preorders : Map.Map<Principal, OldPreorder>;
  };

  type NewPreorder = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    address : Address;
    quantity : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Time.Time;
  };

  type NewActor = {
    preorders : Map.Map<Principal, NewPreorder>;
  };

  public func run(old : OldActor) : NewActor {
    let newPreorders = old.preorders.map<Principal, OldPreorder, NewPreorder>(
      func(id, oldPreorder) {
        {
          id;
          name = oldPreorder.name;
          email = oldPreorder.email;
          phone = "";
          address = {
            street = "";
            city = "";
            state = "";
            pincode = "";
          };
          quantity = oldPreorder.quantity;
          paymentMethod = "COD";
          status = "pending";
          createdAt = 0;
        };
      }
    );
    { preorders = newPreorders };
  };
};
