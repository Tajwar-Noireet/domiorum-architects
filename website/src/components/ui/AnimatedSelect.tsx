"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function AnimatedSelect({
  id,
  labelId,
  name,
  options,
  defaultValue,
}: {
  id: string;
  labelId: string;
  name: string;
  options: readonly string[];
  defaultValue: string;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const listId = useId();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(options.indexOf(defaultValue));
  const [above, setAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const search = useRef({ text: "", time: 0 });

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open)
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [active, open, listId]);

  function show(index = options.indexOf(value)) {
    const bounds = triggerRef.current?.getBoundingClientRect();
    setAbove(
      Boolean(
        bounds && window.innerHeight - bounds.bottom < 260 && bounds.top > 260,
      ),
    );
    setActive(index);
    setOpen(true);
  }

  function choose(index: number) {
    setValue(options[index]);
    setActive(index);
    setOpen(false);
  }

  if (!hydrated) {
    return (
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        aria-labelledby={labelId}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  return (
    <div
      className="animated-select"
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="select-trigger"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            if (!open) show();
            else
              setActive(
                (index) => (index + step + options.length) % options.length,
              );
          } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            const index = event.key === "Home" ? 0 : options.length - 1;
            if (!open) show(index);
            else setActive(index);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (open) choose(active);
            else show();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          } else if (event.key === "Tab") setOpen(false);
          else if (
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            event.preventDefault();
            const now = Date.now();
            search.current.text =
              (now - search.current.time > 700 ? "" : search.current.text) +
              event.key.toLowerCase();
            search.current.time = now;
            const index = options.findIndex((option) =>
              option.toLowerCase().startsWith(search.current.text),
            );
            if (index !== -1) {
              if (open) setActive(index);
              else choose(index);
            }
          }
        }}
      >
        <span>{value}</span>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <motion.ul
        id={listId}
        role="listbox"
        data-lenis-prevent
        aria-labelledby={labelId}
        className={`select-options${above ? " select-options-above" : ""}`}
        inert={!open}
        aria-hidden={!open}
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, scale: 1, visibility: "visible" }
            : {
                opacity: 0,
                y: above ? 6 : -6,
                scale: 0.98,
                transitionEnd: { visibility: "hidden" },
              }
        }
        transition={{
          duration: 0.18,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {options.map((option, index) => (
          <li
            key={option}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={value === option}
            data-active={active === index}
            onPointerDown={(event) => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option}
            <span aria-hidden="true">{value === option ? "✓" : ""}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
