import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";
import { ParentComponent } from "solid-js";
import { Toaster } from "solid-toast";
import colors from "tailwindcss/colors";

const Provider: ParentComponent = (props) => {
  const storageManager = createLocalStorageManager("ui-theme");
  return (
    <>
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider
        storageManager={storageManager}
        initialColorMode="dark"
      >
        {props.children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: colors.neutral["900"],
              color: colors.neutral["100"],
            },
          }}
        />
      </ColorModeProvider>
    </>
  );
};

export default Provider;
