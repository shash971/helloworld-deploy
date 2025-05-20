import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

// Sales model
export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  customerId: integer("customer_id").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
});

// Purchases model
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  poNumber: text("po_number").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  vendorId: integer("vendor_id").notNull(),
  totalAmount: numeric("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
});

// Expenses model
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  category: text("category").notNull(),
  amount: numeric("amount").notNull(),
  description: text("description"),
  createdBy: integer("created_by").notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
});

// Stock models
export const looseStock = pgTable("loose_stock", {
  id: serial("id").primaryKey(),
  itemCode: text("item_code").notNull().unique(),
  stoneType: text("stone_type").notNull(),
  shape: text("shape").notNull(),
  carat: numeric("carat").notNull(),
  color: text("color"),
  clarity: text("clarity"),
  cut: text("cut"),
  quantity: integer("quantity").notNull(),
  costPrice: numeric("cost_price").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  updatedBy: integer("updated_by").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertLooseStockSchema = createInsertSchema(looseStock).omit({
  id: true,
});

export const certifiedStock = pgTable("certified_stock", {
  id: serial("id").primaryKey(),
  itemCode: text("item_code").notNull().unique(),
  stoneType: text("stone_type").notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  laboratory: text("laboratory").notNull(),
  shape: text("shape").notNull(),
  carat: numeric("carat").notNull(),
  color: text("color"),
  clarity: text("clarity"),
  cut: text("cut"),
  costPrice: numeric("cost_price").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  updatedBy: integer("updated_by").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertCertifiedStockSchema = createInsertSchema(certifiedStock).omit({
  id: true,
});

export const jewelleryStock = pgTable("jewellery_stock", {
  id: serial("id").primaryKey(),
  itemCode: text("item_code").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  metalType: text("metal_type").notNull(),
  metalWeight: numeric("metal_weight").notNull(),
  stoneDetails: jsonb("stone_details"),
  grossWeight: numeric("gross_weight").notNull(),
  costPrice: numeric("cost_price").notNull(),
  sellingPrice: numeric("selling_price").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  updatedBy: integer("updated_by").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertJewelleryStockSchema = createInsertSchema(jewelleryStock).omit({
  id: true,
});

// Memo models
export const memoGive = pgTable("memo_give", {
  id: serial("id").primaryKey(),
  memoNumber: text("memo_number").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  customerId: integer("customer_id").notNull(),
  itemType: text("item_type").notNull(),
  itemId: integer("item_id").notNull(),
  expectedReturnDate: timestamp("expected_return_date"),
  status: text("status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
});

export const insertMemoGiveSchema = createInsertSchema(memoGive).omit({
  id: true,
});

export const memoTake = pgTable("memo_take", {
  id: serial("id").primaryKey(),
  memoNumber: text("memo_number").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  vendorId: integer("vendor_id").notNull(),
  itemType: text("item_type").notNull(),
  itemDetails: jsonb("item_details").notNull(),
  expectedReturnDate: timestamp("expected_return_date"),
  status: text("status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
});

export const insertMemoTakeSchema = createInsertSchema(memoTake).omit({
  id: true,
});

// IGI certification models
export const igiIssue = pgTable("igi_issue", {
  id: serial("id").primaryKey(),
  issueNumber: text("issue_number").notNull().unique(),
  date: timestamp("date").notNull().defaultNow(),
  itemType: text("item_type").notNull(),
  itemId: integer("item_id").notNull(),
  expectedCompletionDate: timestamp("expected_completion_date"),
  status: text("status").notNull(),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
});

export const insertIgiIssueSchema = createInsertSchema(igiIssue).omit({
  id: true,
});

export const igiReceive = pgTable("igi_receive", {
  id: serial("id").primaryKey(),
  receiveNumber: text("receive_number").notNull().unique(),
  issueId: integer("issue_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  certificateNumber: text("certificate_number").notNull().unique(),
  status: text("status").notNull(),
  notes: text("notes"),
  updatedBy: integer("updated_by").notNull(),
});

export const insertIgiReceiveSchema = createInsertSchema(igiReceive).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type LooseStock = typeof looseStock.$inferSelect;
export type InsertLooseStock = z.infer<typeof insertLooseStockSchema>;

export type CertifiedStock = typeof certifiedStock.$inferSelect;
export type InsertCertifiedStock = z.infer<typeof insertCertifiedStockSchema>;

export type JewelleryStock = typeof jewelleryStock.$inferSelect;
export type InsertJewelleryStock = z.infer<typeof insertJewelleryStockSchema>;

export type MemoGive = typeof memoGive.$inferSelect;
export type InsertMemoGive = z.infer<typeof insertMemoGiveSchema>;

export type MemoTake = typeof memoTake.$inferSelect;
export type InsertMemoTake = z.infer<typeof insertMemoTakeSchema>;

export type IgiIssue = typeof igiIssue.$inferSelect;
export type InsertIgiIssue = z.infer<typeof insertIgiIssueSchema>;

export type IgiReceive = typeof igiReceive.$inferSelect;
export type InsertIgiReceive = z.infer<typeof insertIgiReceiveSchema>;
