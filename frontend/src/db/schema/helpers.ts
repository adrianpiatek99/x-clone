/**
 * Backend has been rewritten to Rust.
 * See: https://github.com/adrianpiatek99/x-clone/issues/67
 */

// import { timestamp, uuid } from 'drizzle-orm/pg-core';

// export const enumToPgEnum = <T extends Record<string, unknown>>(
//   myEnum: T
// ): [T[keyof T], ...T[keyof T][]] =>
//   Object.values(myEnum).map((value) => `${value}`) as [T[keyof T], ...T[keyof T][]];

// export const id = uuid().primaryKey().defaultRandom();
// export const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
// export const updatedAt = timestamp('updated_at', { withTimezone: true })
//   .notNull()
//   .defaultNow()
//   .$onUpdate(() => new Date());
// export const editedAt = timestamp('edited_at', { withTimezone: true }).notNull().defaultNow();
