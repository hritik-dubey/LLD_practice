// ─── Enums ───────────────────────────────────────────────────────────────────

enum SplitType {
  EQUAL = "EQUAL",
  EXACT = "EXACT",
  PERCENT = "PERCENT",
}

// ─── Entities ────────────────────────────────────────────────────────────────

class User {
  id: string;
  name: string;
  email: string;
  mobile: string;

  constructor(id: string, name: string, email: string, mobile: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.mobile = mobile;
  }
}

class ExpenseSplit {
  userId: string;
  amount: number; // how much this user owes for this expense

  constructor(userId: string, amount: number) {
    this.userId = userId;
    this.amount = amount;
  }
}

class Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string; // userId of who paid
  groupId: string;
  splits: ExpenseSplit[]; // one entry per participant

  constructor(
    id: string,
    description: string,
    totalAmount: number,
    paidBy: string,
    groupId: string,
    splits: ExpenseSplit[]
  ) {
    this.id = id;
    this.description = description;
    this.totalAmount = totalAmount;
    this.paidBy = paidBy;
    this.groupId = groupId;
    this.splits = splits;
  }
}

class Group {
  id: string;
  name: string;
  createdBy: string; // userId
  members: User[];
  expenses: Expense[];

  // balances[A][B] = +X  → A is owed X by B
  // balances[A][B] = -X  → A owes X to B
  balances: Map<string, Map<string, number>>;

  constructor(id: string, name: string, createdBy: string) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.members = [];
    this.expenses = [];
    this.balances = new Map();
  }
}

// ─── Split Strategies ────────────────────────────────────────────────────────

interface SplitStrategy {
  computeSplits(
    members: User[],
    totalAmount: number,
    paidBy: string,
    extras?: number[] // exact amounts or percentages per member (same order as members)
  ): ExpenseSplit[];
}

class EqualSplitStrategy implements SplitStrategy {
  computeSplits(members: User[], totalAmount: number): ExpenseSplit[] {
    const share = totalAmount / members.length;
    return members.map((u) => new ExpenseSplit(u.id, parseFloat(share.toFixed(2))));
  }
}

class ExactSplitStrategy implements SplitStrategy {
  computeSplits(
    members: User[],
    totalAmount: number,
    paidBy: string,
    exactAmounts: number[]
  ): ExpenseSplit[] {
    const sum = exactAmounts.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - totalAmount) > 0.01) {
      throw new Error(`Exact amounts (${sum}) don't add up to total (${totalAmount})`);
    }
    return members.map((u, i) => new ExpenseSplit(u.id, exactAmounts[i]));
  }
}

class PercentSplitStrategy implements SplitStrategy {
  computeSplits(
    members: User[],
    totalAmount: number,
    paidBy: string,
    percents: number[]
  ): ExpenseSplit[] {
    const sum = percents.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 0.01) {
      throw new Error(`Percentages must add up to 100, got ${sum}`);
    }
    return members.map(
      (u, i) => new ExpenseSplit(u.id, parseFloat(((percents[i] / 100) * totalAmount).toFixed(2)))
    );
  }
}

// ─── Services ────────────────────────────────────────────────────────────────

class UserService {
  private users: Map<string, User> = new Map();

  createUser(id: string, name: string, email: string, mobile: string): User {
    const user = new User(id, name, email, mobile);
    this.users.set(id, user);
    return user;
  }

  getUser(id: string): User {
    const user = this.users.get(id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  }

  updateProfile(id: string, updates: Partial<Pick<User, "name" | "email" | "mobile">>): User {
    const user = this.getUser(id);
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.mobile) user.mobile = updates.mobile;
    return user;
  }
}

class GroupService {
  private groups: Map<string, Group> = new Map();

  createGroup(id: string, name: string, createdBy: User): Group {
    const group = new Group(id, name, createdBy.id);
    group.members.push(createdBy);
    this.groups.set(id, group);
    return group;
  }

  getGroup(id: string): Group {
    const group = this.groups.get(id);
    if (!group) throw new Error(`Group ${id} not found`);
    return group;
  }

  addMember(group: Group, user: User): void {
    const already = group.members.find((m) => m.id === user.id);
    if (!already) group.members.push(user);
  }

  removeMember(group: Group, userId: string): void {
    group.members = group.members.filter((m) => m.id !== userId);
  }
}

class ExpenseService {
  private updateBalances(group: Group, paidBy: string, splits: ExpenseSplit[]): void {
    for (const split of splits) {
      if (split.userId === paidBy) continue; // payer doesn't owe themselves

      // paidBy is owed `split.amount` by split.userId
      this.updateBalance(group, paidBy, split.userId, split.amount);
    }
  }

  private updateBalance(group: Group, creditor: string, debtor: string, amount: number): void {
    if (!group.balances.has(creditor)) group.balances.set(creditor, new Map());
    if (!group.balances.has(debtor)) group.balances.set(debtor, new Map());

    const creditorMap = group.balances.get(creditor)!;
    const debtorMap = group.balances.get(debtor)!;

    creditorMap.set(creditor, (creditorMap.get(debtor) ?? 0) + amount);
    debtorMap.set(debtor, (debtorMap.get(creditor) ?? 0) - amount);
  }

  addExpense(
    group: Group,
    expense: { id: string; description: string; totalAmount: number; paidBy: string },
    strategy: SplitStrategy,
    extras?: number[]
  ): Expense {
    const payer = group.members.find((m) => m.id === expense.paidBy);
    if (!payer) throw new Error(`Payer ${expense.paidBy} is not a group member`);

    const splits = strategy.computeSplits(
      group.members,
      expense.totalAmount,
      expense.paidBy,
      extras
    );

    const newExpense = new Expense(
      expense.id,
      expense.description,
      expense.totalAmount,
      expense.paidBy,
      group.id,
      splits
    );

    group.expenses.push(newExpense);
    this.updateBalances(group, expense.paidBy, splits);
    return newExpense;
  }

  // Returns net balance between two users in a group
  // positive → userA is owed money by userB
  // negative → userA owes money to userB
  getBalance(group: Group, userAId: string, userBId: string): number {
    return group.balances.get(userAId)?.get(userBId) ?? 0;
  }

  // Returns all non-zero balances for a user in the group
  getUserBalances(group: Group, userId: string): { with: string; amount: number }[] {
    const result: { with: string; amount: number }[] = [];
    const userMap = group.balances.get(userId);
    if (!userMap) return result;

    for (const [otherId, amount] of userMap.entries()) {
      if (Math.abs(amount) > 0.01) {
        result.push({ with: otherId, amount });
      }
    }
    return result;
  }

  // Settle up: zero out balance between two users
  settleUp(group: Group, payerId: string, payeeId: string): void {
    const amount = this.getBalance(group, payeeId, payerId); // payeeId is owed by payerId
    if (amount <= 0) {
      console.log(`${payerId} does not owe ${payeeId} anything`);
      return;
    }
    // clear the debt
    group.balances.get(payeeId)?.set(payerId, 0);
    group.balances.get(payerId)?.set(payeeId, 0);
    console.log(`${payerId} settled ₹${amount} with ${payeeId}`);
  }
}

// ─── Usage Example ───────────────────────────────────────────────────────────

const userService = new UserService();
const groupService = new GroupService();
const expenseService = new ExpenseService();

const alice = userService.createUser("u1", "Alice", "alice@mail.com", "9000000001");
const bob = userService.createUser("u2", "Bob", "bob@mail.com", "9000000002");
const carol = userService.createUser("u3", "Carol", "carol@mail.com", "9000000003");

const trip = groupService.createGroup("g1", "Goa Trip", alice);
groupService.addMember(trip, bob);
groupService.addMember(trip, carol);

// Alice pays ₹300, split equally
expenseService.addExpense(
  trip,
  { id: "e1", description: "Hotel", totalAmount: 300, paidBy: "u1" },
  new EqualSplitStrategy()
);

// Bob pays ₹120, split by percent: Alice 50%, Bob 25%, Carol 25%
expenseService.addExpense(
  trip,
  { id: "e2", description: "Dinner", totalAmount: 120, paidBy: "u2" },
  new PercentSplitStrategy(),
  [50, 25, 25]
);

console.log("Alice's balances:", expenseService.getUserBalances(trip, "u1"));
console.log("Bob's balances:", expenseService.getUserBalances(trip, "u2"));
console.log("Carol's balances:", expenseService.getUserBalances(trip, "u3"));

expenseService.settleUp(trip, "u2", "u1"); // Bob settles with Alice
