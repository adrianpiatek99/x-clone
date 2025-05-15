fn main() {
    // Watch for changes in models and enums
    println!("cargo:rerun-if-changed=src/models");
    println!("cargo:rerun-if-changed=src/enums");
}