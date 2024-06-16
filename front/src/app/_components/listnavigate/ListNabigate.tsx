"use client";
import "./ListNavigate.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function ListNavigate() {
  const pathname = usePathname();
  return (
    <ul className="links-list">
      <li>
        <a
          href="/indicate"
          className={`link ${pathname === "/indicate" ? "active" : ""}`}
        >
          Совместить подоснову с моделью здания
        </a>
      </li>
      <li>
        <a
          href="/calculate"
          className={`link ${pathname === "/calculate" ? "active" : ""}`}
        >
          Загрузить решение
        </a>
      </li>
      <li>
        <a
          href="/verification"
          className={`link ${pathname === "/verification" ? "active" : ""}`}
        >
          Проверить решение
        </a>
      </li>
      <li>
        <a
          href="/overlay"
          className={`link ${pathname === "/overlay" ? "active" : ""}`}
        >
          Для проверки
        </a>
      </li>
    </ul>
  );
}
