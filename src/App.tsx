import classNames from "classnames";
import { useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { context } from "./context";
import data from "./data/data.json";
import { categories, getChildren, isChild } from "./utils/util";

const showId = false;
import i18n from "./i18n";

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

  const { t, i18n } = useTranslation("index");

  return (
    <>
      <main className="mx-auto max-w-7xl p-6">
        <h1 className="text-3xl font-bold underline text-center">
          {t("title")}
        </h1>
        <p className="text-center mt-2 text-sm">{t("description")}</p>
        <h2 className="text-2xl font-bold text-center my-3 md:text-left">
          {t("Translations")}
        </h2>
        <ul>
          <li className="underline underline-offset-1 text-blue-400">
            <span role="button" onClick={() => i18n.changeLanguage("en")}>
              English
            </span>
          </li>
          <li className="underline underline-offset-1 text-blue-400">
            <span role="button" onClick={() => i18n.changeLanguage("pt-BR")}>
              Português (Brasil)
            </span>
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-center my-3 md:text-left">
          {t("how-to-use")}
        </h2>
        <p className="text-slate-900">
          <ul className="list-decimal ml-3 space-y-2">
            <li>{t("how-to-select", { col: "✅" })}</li>
            <li>{t("how-to-disable", { col: "❌" })}</li>
            <li>{t("how-to-calculate")}</li>
            <li>{t("how-to-clear")}</li>
            <li>
              {t("indicators-text")}
              <ul className="list-disc ml-4 font-semibold">
                <li className="text-green-500">
                  {t("indicators-text-selected")}
                </li>
                <li className="text-green-600">
                  {t("indicators-text-child-selected")}
                </li>
                <li className="text-red-500">
                  {t("indicators-text-disabled")}
                </li>
              </ul>
            </li>
          </ul>
        </p>

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
                      ✅
                    </th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                      ❌
                    </th>
                    {showId && (
                      <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                        ID
                      </th>
                    )}
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Name
                    </th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                      GP
                    </th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
                      Type
                    </th>
                    <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Skills Requirements
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
                                  "text-green-700": isChildren && !disabled,
                                  "text-green-500": isSelected && !disabled,
                                  "line-through	text-red-500": disabled,
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
                                  const disabled = isDisabled(r.id);
                                  return (
                                    <li
                                      key={r.id}
                                      className="after:content-[','] last:after:content-none"
                                    >
                                      <a
                                        className={classNames(
                                          "hover:underline hover:cursor-pointer",
                                          {
                                            "text-green-600": !disabled,
                                            "line-through	text-red-500":
                                              disabled,
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
          <p className="font-semibold">
            <Trans i18nKey="result-gp" gpTotal={gpTotal} t={t}>
              used so far:
              <span className="text-red-500">
                {/** @ts-ignore */}
                {{ gpTotal }}
              </span>{" "}
              GP
            </Trans>
          </p>
        </div>
        <button className="border px-2 m-2" onClick={clearSelected}>
          {t("reset-selected")}
        </button>
        <button className="border px-2 m-2" onClick={clearDisabled}>
          {t("reset-disabled")}
        </button>
      </div>
    </>
  );
}

export default App;
