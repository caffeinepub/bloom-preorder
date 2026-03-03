import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Preorder = {
    name : Text;
    email : Text;
    quantity : Nat;
  };

  let preorders = Map.empty<Principal, Preorder>();

  public shared ({ caller }) func submitPreorder(name : Text, email : Text, quantity : Nat) : async () {
    if (preorders.containsKey(caller)) { Runtime.trap("Preorder already submitted with this caller.") };
    let preorder : Preorder = {
      name;
      email;
      quantity;
    };
    preorders.add(caller, preorder);
  };

  public query ({ caller }) func getTotalPreorders() : async Nat {
    preorders.size();
  };

  public query ({ caller }) func getAllPreorders() : async [Preorder] {
    preorders.values().toArray();
  };
};
