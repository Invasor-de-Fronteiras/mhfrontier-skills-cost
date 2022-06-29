import { createContext, useCallback, useMemo, useState } from "react";
import { isChild, sumGP } from "./utils/util";

interface State {
  selectedIds: number[];
  disabledIds: number[];
  toggleSelected: (id: number) => void;
  toggleDisabled: (id: number) => void;
  isDisabled: (id: number) => boolean;
  clearSelected: () => void;
  clearDisabled: () => void;
  gpTotal: number;
}

export const context = createContext<State>({} as State);

interface ProviderProps {
  children: React.ReactNode;
}

export function Provider({ children }: ProviderProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [disables, setDisabled] = useState<number[]>([]);

  const toggleSelected = (id: number) => {
    setSelected((v) => {
      const arr = new Set(v);

      const shouldDelete = arr.has(id);
      if (shouldDelete) {
        arr.delete(id);
      } else {
        arr.add(id);
      }

      return [...arr];
    });
  };

  const toggleDisabled = (id: number) => {
    setDisabled((v) => {
      const arr = new Set(v);

      if (arr.has(id)) {
        arr.delete(id);
      } else {
        arr.add(id);
      }

      return [...arr];
    });
  };

  const isDisabled = useCallback(
    (id: number) => disables.includes(id) || isChild(disables, id),
    [disables]
  );

  // ! it should have the disabled ids in hook dependencies for works
  const gpTotal = useMemo(
    () => sumGP(selected, isDisabled),
    [selected, disables]
  );

  return (
    <context.Provider
      value={{
        selectedIds: selected,
        disabledIds: disables,
        toggleSelected,
        toggleDisabled,
        gpTotal,
        isDisabled,
        clearSelected: () => setSelected([]),
        clearDisabled: () => setDisabled([]),
      }}
    >
      {children}
    </context.Provider>
  );
}
