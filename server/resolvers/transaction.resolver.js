import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (error) {
        console.error("Error in getting transactions: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (error) {
        console.error("Error in getting transaction: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    categoryStatistics: async (_, __, context) => {
      try {
        if (!context.getUser()) {
          throw new Error("Unauthorized");
        }
        const userId = await context.getUser()._id;
        const transactions = await Transaction.find({ userId });
        const categoryMap = {};
        transactions.forEach((item) => {
          if (!categoryMap[item.category]) {
            categoryMap[item.category] = 0;
          }
          categoryMap[item.category] += item.amount;
        });

        return Object.entries(categoryMap).map(([category, amount]) => ({
          category,
          totalAmount: amount,
        }));
      } catch (error) {
        console.error("Error in getting statistic: ", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });
        await newTransaction.save();
        return newTransaction;
      } catch (error) {
        console.error("Error in creating transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    updateTransaction: async (_, { input }, context) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );
        return updatedTransaction;
      } catch (error) {
        console.error("Error in updating transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },
    deleteTransaction: async (_, { transactionId }, context) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
          transactionId
        );
        return deletedTransaction;
      } catch (error) {
        console.error("Error in deleting transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
  Transaction: {
    user: async (parent, args, context) => {
      try {
        const userId = parent.userId; // parent is transaction
        const user = await User.findById(userId);
        return user;
      } catch (error) {
        console.error("Error in transaction.user resolver", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
};

export default transactionResolver;
