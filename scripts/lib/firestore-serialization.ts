import { GeoPoint, Timestamp, type Firestore } from "firebase-admin/firestore";

/** Restorable JSON for the Firestore value types used by this website. */
export function encodeFirestore(value: unknown): unknown {
  if (value instanceof Timestamp) return { __firestoreType: "timestamp", seconds: value.seconds, nanoseconds: value.nanoseconds };
  if (value instanceof GeoPoint) return { __firestoreType: "geopoint", latitude: value.latitude, longitude: value.longitude };
  if (value instanceof Date) return { __firestoreType: "date", iso: value.toISOString() };
  if (Buffer.isBuffer(value)) return { __firestoreType: "bytes", base64: value.toString("base64") };
  if (Array.isArray(value)) return value.map(encodeFirestore);
  if (value && typeof value === "object") {
    if ("path" in value && "firestore" in value && typeof (value as { path?: unknown }).path === "string") {
      return { __firestoreType: "reference", path: (value as { path: string }).path };
    }
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      throw new Error(`Unsupported Firestore type ${value.constructor?.name || "unknown"}; backup aborted before writes.`);
    }
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, encodeFirestore(entry)]));
  }
  return value;
}

export function decodeFirestore(value: unknown, db: Firestore): unknown {
  if (Array.isArray(value)) return value.map((item) => decodeFirestore(item, db));
  if (value && typeof value === "object") {
    const data = value as Record<string, unknown>;
    if (data.__firestoreType === "timestamp") return new Timestamp(Number(data.seconds), Number(data.nanoseconds));
    if (data.__firestoreType === "geopoint") return new GeoPoint(Number(data.latitude), Number(data.longitude));
    if (data.__firestoreType === "date") return new Date(String(data.iso));
    if (data.__firestoreType === "bytes") return Buffer.from(String(data.base64), "base64");
    if (data.__firestoreType === "reference") return db.doc(String(data.path));
    return Object.fromEntries(Object.entries(data).map(([key, entry]) => [key, decodeFirestore(entry, db)]));
  }
  return value;
}
