// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assert, assertArrayEquals, assertEquals, test } from "checkin:testing";

const {
  op_pipe_create,
  op_file_open,
  op_async_make_cppgc_resource,
  op_async_get_cppgc_resource,
  op_stateful_new,
} = Deno.core.ops;

test(async function testPipe() {
  const [p1, p2] = op_pipe_create();
  assertEquals(3, await Deno.core.write(p1, new Uint8Array([1, 2, 3])));
  const buf = new Uint8Array(10);
  assertEquals(3, await Deno.core.read(p2, buf));
  assertArrayEquals(buf.subarray(0, 3), [1, 2, 3]);
});

test(async function testPipeSmallRead() {
  const [p1, p2] = op_pipe_create();
  assertEquals(
    6,
    await Deno.core.write(p1, new Uint8Array([1, 2, 3, 4, 5, 6])),
  );
  const buf = new Uint8Array(1);
  for (let i = 1; i <= 6; i++) {
    assertEquals(1, await Deno.core.read(p2, buf));
    assertArrayEquals(buf.subarray(0), [i]);
  }
});

test(async function opsAsyncBadResource() {
  try {
    const nonExistingRid = 9999;
    await Deno.core.read(
      nonExistingRid,
      new Uint8Array(100),
    );
  } catch (e) {
    assert(e instanceof Deno.core.BadResource);
  }
});

test(function opsSyncBadResource() {
  try {
    const nonExistingRid = 9999;
    Deno.core.readSync(
      nonExistingRid,
      new Uint8Array(100),
    );
  } catch (e) {
    assert(e instanceof Deno.core.BadResource);
  }
});

test(async function testFileIsNotTerminal() {
  const file = await op_file_open("./README.md");
  assert(!Deno.core.isTerminal(file));
});

test(async function testCppgcAsync() {
  const resource = await op_async_make_cppgc_resource();
  assertEquals(await op_async_get_cppgc_resource(resource), 42);
});

test(async function testCppgcObjectMethods() {
  const obj = op_stateful_new("A");
  const name = obj.get_name();

  assertEquals(name, "A");
  obj.print_name();
});
