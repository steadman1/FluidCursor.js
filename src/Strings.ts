interface String {
  /**
   * Returns a string where all the characters are in lowercase.
   */
  isEmpty(): boolean;
}

String.prototype.isEmpty = function() {
  return this.trim() === "";
}