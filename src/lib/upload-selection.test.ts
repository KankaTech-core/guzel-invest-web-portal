import assert from "node:assert/strict";
import test from "node:test";
import { selectFilesForUpload } from "./upload-selection";

test("selectFilesForUpload limits to the first file when useFirstOnly is true", () => {
    const files = ["cover-1.jpg", "cover-2.jpg", "cover-3.jpg"];

    const selected = selectFilesForUpload(files, { useFirstOnly: true });

    assert.deepEqual(selected, ["cover-1.jpg"]);
});

test("selectFilesForUpload keeps all files when useFirstOnly is false", () => {
    const files = ["a.jpg", "b.jpg"];

    const selected = selectFilesForUpload(files, { useFirstOnly: false });

    assert.deepEqual(selected, ["a.jpg", "b.jpg"]);
});

test("selectFilesForUpload keeps all files by default", () => {
    const files = ["a.jpg", "b.jpg"];

    const selected = selectFilesForUpload(files);

    assert.deepEqual(selected, ["a.jpg", "b.jpg"]);
});
