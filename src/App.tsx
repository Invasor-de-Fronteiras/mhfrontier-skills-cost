import classNames from "classnames";
import { useContext } from "react";
import { context } from "./context";
import data from "./data/data.json";
import { categories, getChildren, isChild } from "./utils/util";

const showId = false;

function App() {
  const {
    disabledIds,
    gpTotal,
    selectedIds,
    toggleDisabled,
    toggleSelected,
    isDisabled,
    clearDisabled,
    clearSelected,
  } = useContext(context);

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
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                      Disabled?
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
                      const isSelected = selectedIds.includes(skill.id);
                      const isChildren = isChild(selectedIds, skill.id);
                      const disabled = isDisabled(skill.id);

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
                              disabled={disabled}
                              onChange={(e) => toggleSelected(skill.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">
                            <input
                              type="checkbox"
                              className=""
                              checked={disabledIds.includes(skill.id)}
                              onChange={(e) => toggleDisabled(skill.id)}
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
                                  "line-through	text-gray-500": disabled,
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
                                        className={classNames(
                                          "hover:underline hover:cursor-pointer",
                                          {
                                            "line-through	text-gray-500":
                                              disabledIds.includes(r.id),
                                          }
                                        )}
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
                                        className={classNames(
                                          "hover:underline hover:cursor-pointer text-orange-700",
                                          {
                                            "line-through	text-gray-500":
                                              isDisabled(r.id),
                                          }
                                        )}
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
            used so far: <span className="text-red-500">{gpTotal}</span> GP
          </p>
        </div>
        <button className="border px-2 m-2" onClick={clearSelected}>
          Reset Checked
        </button>
        <button className="border px-2 m-2" onClick={clearDisabled}>
          Reset Disabled
        </button>
      </div>
    </>
  );
}

export default App;
