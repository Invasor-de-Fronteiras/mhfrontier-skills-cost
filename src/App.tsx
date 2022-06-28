import { useMemo, useState } from "react";
import data from "./data/data.json";
import { getChildren } from "./utils/util";

function App() {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (...ids: number[]) => {
    setSelected((v) => {
      const arr = new Set(v);

      // first is parent, rest are dependents
      const shouldDelete = arr.has(ids[0]);

      for (const id of ids) {
        if (shouldDelete) {
          //TODO Check if some depend on it, if yes, remove dependents.
          arr.delete(id);
        } else {
          arr.add(id);
        }
      }

      return [...arr];
    });
  };

  const gpCost = useMemo(() => {
    let gp = 0;

    for (const id of selected) {
      const item = data.find((i) => i.id === id);
      if (item && item.gp) {
        gp += item.gp;
      }
    }
    return gp;
  }, [selected]);

  return (
    <>
      <main className="mx-auto max-w-7xl p-6 text-center ">
        <h1 className="text-3xl font-bold underline">
          MHFrontier Skills Cost Simulator!
        </h1>
        <div className="overflow-x-auto">
          <table className="mt-6 border rounded min-w-full overflow-x-visible">
            <thead className="border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                  #
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                  Name
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                  GP
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                  Type
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                  Requirements
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((skill) => {
                return (
                  <tr
                    key={skill.id}
                    className="border-b  transition duration-300 ease-in-out hover:bg-gray-100"
                    id={skill.id.toString()}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(skill.id)}
                        onClick={() =>
                          handleToggle(skill.id, ...(skill.requirements ?? []))
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <a
                        id={skill.name}
                        className="hover:cursor-pointer hover:underline"
                        href={"#" + skill.name}
                      >
                        {skill.name}
                      </a>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {skill.gp}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {skill.type}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 text-left whitespace-nowrap">
                      {!skill.requirements?.length ? (
                        "None"
                      ) : (
                        <ul className="flex flex-row flex-wrap gap-1">
                          {getChildren(skill.id).map((r) => {
                            return (
                              <a
                                className="hover:underline hover:cursor-pointer"
                                href={"#" + r.name}
                              >
                                {r.name}
                              </a>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
      <div className="bg-black fixed z-10 bottom-0 w-full text-white flex flex-wrap  items-center justify-center">
        <div>
          <p>
            GP usados ate o momento:{" "}
            <span className="text-red-500">{gpCost}</span> GP
          </p>
        </div>
        <button className="border px-2 m-2" onClick={() => setSelected([])}>
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
