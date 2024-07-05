// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
#![deny(warnings)]
deno_ops_compile_test_runner::prelude!();

// Test w/ import pollution
#[allow(unused)]
use std::borrow::Borrow;
#[allow(unused)]
use std::borrow::BorrowMut;

struct Something {}

#[op2]
fn op_state_rc(
  #[state] _arg: &Something,
  #[state] _arg_opt: Option<&Something>,
) {
}
