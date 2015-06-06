import a from 'assert';

{
  a.ok();
  {
    let a = {};
    a.ok();
  }
  a.ok();
}
