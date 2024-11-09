{
  description = "Nix environment for development.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-root.url = "github:srid/flake-root";
  };

  outputs = inputs@{ nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; }
      {
        imports = [
          inputs.flake-root.flakeModule
        ];
        systems = [
          "x86_64-linux"
          "aarch64-linux"
          "aarch64-darwin"
        ];
        perSystem = { pkgs, lib, config, ... }: {
          devShells.default = pkgs.mkShell {
            inputsFrom = [ config.flake-root.devShell ];

            name = "kott";

            # dev tools
            nativeBuildInputs = with pkgs; [
              nodejs # nodejs
              nodePackages.pnpm # pnpm
            ];
          };
        };
      };
}

