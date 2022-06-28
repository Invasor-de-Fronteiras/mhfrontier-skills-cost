import classNames from "classnames";
import { useMemo, useState } from "react";
import data from "./data/data.json";
import { categories, getChildren, isChild, sumGP } from "./utils/util";

const showId = false;

function App() {
  const [selected, setSelected] = useState<number[]>([]);

  const handleToggle = (id: number) => {
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

  const gpCost = useMemo(() => sumGP(selected), [selected]);

  return (
    <>
      <main className="mx-auto max-w-7xl p-6 text-center ">
        <h1 className="text-3xl font-bold underline">
          MHFrontier Skills Cost Simulator!
        </h1>
        {categories.map((type) => (
          <div className="mt-6">
            <h3 className="text-left text-2xl font-bold mb-2" id={type}>
              <a className="hover:underline" href={"#" + type}>
                {type}
              </a>
            </h3>
            <div className="overflow-x-auto">
              <table className=" border rounded min-w-full overflow-x-visible">
                <thead className="border-b">
                  <tr>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                      #
                    </th>
                    {showId && (
                      <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                        ID
                      </th>
                    )}
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
                  {data
                    .filter((v) => v.type === type)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((skill) => {
                      const isSelected = selected.includes(skill.id);
                      const isChildren = isChild(selected, skill.id);

                      return (
                        <tr
                          key={skill.id}
                          className="border-b  transition duration-300 ease-in-out hover:bg-gray-100"
                          id={skill.id.toString()}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggle(skill.id)}
                            />
                          </td>
                          {showId && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {skill.id}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <a
                              id={skill.name}
                              className={classNames(
                                "hover:cursor-pointer hover:underline",
                                {
                                  "text-orange-700": isChildren,
                                  "text-green-500": isSelected,
                                }
                              )}
                              href={"#" + skill.name}
                            >
                              {skill.name}
                            </a>
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {skill.gp}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <a
                              className="hover:underline hover:cursor-pointer"
                              href={"#" + type}
                            >
                              {skill.type}
                            </a>
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 text-left whitespace-nowrap">
                            {!skill.requirements?.length ? (
                              "None"
                            ) : (
                              <ul className="flex flex-row flex-wrap requirements-list gap-1">
                                {getChildren(skill.id, {
                                  recursive: false,
                                  shouldReturnParentsRequirements: true,
                                }).map((r) => {
                                  return (
                                    <li
                                      key={r.id}
                                      className="after:content-[','] last:after:content-none"
                                    >
                                      <a
                                        className="hover:underline hover:cursor-pointer"
                                        href={"#" + r.name}
                                      >
                                        {r.name} {showId && `(${r.id})`}
                                      </a>
                                    </li>
                                  );
                                })}
                                {getChildren(skill.id, {
                                  recursive: true,
                                  shouldReturnParentsRequirements: false,
                                }).map((r) => {
                                  return (
                                    <li
                                      key={r.id}
                                      className="after:content-[','] last:after:content-none"
                                    >
                                      <a
                                        className="hover:underline hover:cursor-pointer text-orange-700"
                                        href={"#" + r.name}
                                      >
                                        {r.name} {showId && `(${r.id})`}
                                      </a>
                                    </li>
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
          </div>
        ))}
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
