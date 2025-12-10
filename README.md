# Next.js Starter Template

A modern Next.js 16 starter template with authentication, internationalization (i18n), dashboard, and database integration.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **i18n**: next-intl (Arabic & English)
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: GSAP

---

## Folder Structure

```
├── messages/                    # Localization files
│   ├── ar.json                 # Arabic translations
│   └── en.json                 # English translations
│
├── public/                      # Static assets
│   └── assets/                 # Images, logos, etc.
│
├── scripts/                     # Database seed scripts
│   └── seed-example.ts         # Example seed script pattern
│
├── src/
│   ├── actions/                # Server Actions (Pattern: paginated data fetching)
│   │   └── items.ts            # Example action with types and pagination
│   │
│   ├── app/
│   │   └── [locale]/           # Locale-based routing (ar/en)
│   │       ├── (auth)/         # Auth route group (sign-in, sign-up, etc.)
│   │       │   ├── sign-in/
│   │       │   ├── sign-up/
│   │       │   ├── confirm/
│   │       │   ├── forgot-password/
│   │       │   └── reset-password/
│   │       │
│   │       ├── (website)/      # Public website route group
│   │       │   ├── layout.tsx  # Website layout (Header + Footer)
│   │       │   └── page.tsx    # Home page
│   │       │
│   │       ├── dashboard/      # Protected dashboard route group
│   │       │   ├── layout.tsx  # Dashboard layout (Sidebar + Topbar)
│   │       │   └── page.tsx    # Dashboard home
│   │       │
│   │       ├── globals.css     # Global styles
│   │       └── layout.tsx      # Root layout (providers, fonts)
│   │
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   │   ├── Topbar.tsx      # Top navigation bar
│   │   │   └── ItemsLoadMore.tsx  # Load more pattern example
│   │   │
│   │   ├── sections/           # Page sections
│   │   │   └── HeroSection.tsx # Hero slider component
│   │   │
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Header.tsx          # Website header
│   │   ├── Footer.tsx          # Website footer
│   │   └── ...                 # Other shared components
│   │
│   ├── i18n/                   # Internationalization config
│   │   ├── routing.ts          # Locale routing config
│   │   └── request.ts          # Request config for next-intl
│   │
│   └── lib/
│       ├── db/
│       │   ├── drizzle.ts      # Database connection
│       │   └── schema/
│       │       ├── index.ts    # Schema exports
│       │       ├── auth-schema.ts   # Auth tables (user, session, account)
│       │       └── academy-schema.ts # App-specific tables
│       │
│       ├── auth.ts             # Better Auth configuration
│       ├── auth-client.ts      # Auth client helpers
│       └── utils.ts            # Utility functions
│
├── drizzle.config.ts           # Drizzle ORM configuration
├── middleware.ts               # Next.js middleware (auth + i18n)
└── package.json
```

---

## Patterns

### 1. Locale Files Pattern (`messages/*.json`)

Structure translations by feature/component:

```json
{
    "HomePage": { ... },
    "HeroSection": { ... },
    "LoginForm": { ... },
    "dashboard": {
        "sidebar": { ... },
        "home": { ... }
    }
}
```

### 2. Database Schema Pattern (`src/lib/db/schema/`)

- **auth-schema.ts**: Authentication tables (don't modify)
- **academy-schema.ts**: Your app-specific tables

```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const item = pgTable("item", {
    id: text("id").primaryKey(),
    nameEn: text("name_en").notNull(),
    nameAr: text("name_ar").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 3. Server Actions Pattern (`src/actions/`)

Create typed, paginated data fetching:

```typescript
"use server";

export type Item = { id: string; nameEn: string; nameAr: string };
export type GetItemsResult = { items: Item[]; hasMore: boolean };

export async function getItems(page = 1, limit = 15): Promise<GetItemsResult> {
    const offset = (page - 1) * limit;
    const result = await db.select().from(item).limit(limit + 1).offset(offset);
    const hasMore = result.length > limit;
    return { items: hasMore ? result.slice(0, limit) : result, hasMore };
}
```

### 4. Load More Component Pattern (`src/components/dashboard/`)

Client component with pagination state:

```typescript
"use client";

export default function ItemsLoadMore({ initialItems, initialHasMore }) {
    const [items, setItems] = useState(initialItems);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isPending, startTransition] = useTransition();

    const loadMore = () => {
        startTransition(async () => {
            const result = await getItems(page + 1);
            setItems(prev => [...prev, ...result.items]);
            setPage(p => p + 1);
            setHasMore(result.hasMore);
        });
    };
    // ... render
}
```

### 5. Page Sections Pattern (`src/components/sections/`)

Reusable page sections with i18n:

```typescript
"use client";

const HeroSection = () => {
    const t = useTranslations('HeroSection');
    const locale = useLocale();
    // ... component logic
};
```

### 6. Route Groups Pattern (`src/app/[locale]/`)

- `(auth)/` - Authentication pages (no shared layout)
- `(website)/` - Public pages with Header/Footer
- `dashboard/` - Protected pages with Sidebar/Topbar

### 7. Seed Script Pattern (`scripts/`)

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { item } from "../src/lib/db/schema/academy-schema";
import { nanoid } from "nanoid";

const items = [{ nameEn: "Item 1", nameAr: "عنصر 1" }];

async function main() {
    await client.connect();
    for (const data of items) {
        await db.insert(item).values({ id: nanoid(), ...data });
    }
    await client.end();
}
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Add your DATABASE_URL and auth credentials
   ```

3. **Push database schema**
   ```bash
   npm run db:push
   ```

4. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed the database |

---

## Adding New Features

### Add a new database table

1. Add schema in `src/lib/db/schema/academy-schema.ts`
2. Run `npm run db:push`
3. Create seed script in `scripts/`

### Add a new server action

1. Create file in `src/actions/`
2. Define types and async function with `"use server"`

### Add a new dashboard page

1. Create folder in `src/app/[locale]/dashboard/your-page/`
2. Add `page.tsx`
3. Add sidebar link in `Sidebar.tsx`
4. Add translations in `messages/*.json`

### Add a new website page

1. Create folder in `src/app/[locale]/(website)/your-page/`
2. Add `page.tsx`
3. Add translations in `messages/*.json`
