---
title: memo:reading futures-await
date: 2018-01-11
categories:
- Code Reading
tags:
  - Rust
description: memo
---

[futures-rs](https://github.com/alexcrichton/futures-rs) is a libary allows zero cost abstruction of state machine; `Future` trait in Rust.

futures-await provides Async/await syntax for `futures-rs`.


## #[async]
make it returns future instead of result.

```rust
#[async] // tagged with #[async] option
fn fetch(c: Client) -> Result<T> {
  let res = await!()?; // Optional
  if !res.status().is_success() { // Err }

}
```

## #[async_stream]
stream instead of future

```rust
#[async_stream(item=T)]
for s in T {
  ...
  stream_yield!(await!(..))
}
```

## await! macro
`await!` macro allows blocking the procedure until completion, not blocking the thread.

it behaves like a function returns `Result(e)`


here is a brief procedure of `await!` macro.

```rust
macro_rules! await {
  let mut future = $e
  loop {
    match poll(&mut future) {
      Ok(Ready(e)) => break Ok(e),
      Ok(NotReady) => {}, // continue and wait
      Err(e) => Err(e)
    }
  }
  // block until NotReady -> Ready(e)
  yield futures::Async::NotReady
}
```

## async_block! macro
it doesn't need a dedicated function like `#[async]`, (I think it's a like `thread::spawn()`, so it can be run with `core.run(Fn(async_block!))`)

```rust
pub fn spawn<F, T>(f: F) -> JoinHandle<T>
  where F: FnOnce() -> T,
  F: Send + 'static, T: Send + 'static

```

here's the brief internal procedure of async_block macro.

```rust
#[proc_macro]
fn async_block(i: TokenStream) -> TokenStream {
  // input -> TokenTree -> TokenStream -> parse -> TokenStream
  let input = TokenStream::from(TokenTree {...,
    // parse input as token node
    ..., kind: TokenNode::Group(Delimiter::Brace, i)})

  let expr = syn::parse(input)

  // token construction..
  token.into() // return Stream
}
```

## nightly features
- [generators](https://github.com/rust-lang/rust/issues/43122)
- [proc_macro](https://github.com/rust-lang/rust/issues/35896)
- [conservative_impl_trait](https://github.com/rust-lang/rust/issues/42183)

