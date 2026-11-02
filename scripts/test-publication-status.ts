import assert from "node:assert/strict";
import { isPublicDetailStatus } from "../src/lib/publication-status";
assert.equal(isPublicDetailStatus({status: "published"}), true);
assert.equal(isPublicDetailStatus({status: "draft"}), false);
assert.equal(isPublicDetailStatus({}), true);
assert.equal(isPublicDetailStatus({status: null}), true);
assert.equal(isPublicDetailStatus({status: "archived"}), false);
assert.equal(isPublicDetailStatus({status: "Published"}), false);
console.log("PASS: published / legacy missing status accessible; drafts / unknown statuses blocked");
