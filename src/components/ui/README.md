# UI Components

## Verification Badges

Three types of verification badges for users:

### Usage

```tsx
import { VerificationBadge } from "@/components/ui/verification-badge";

// Verified Creator (Gold)
<VerificationBadge type="creator" size={20} />

// Verified Human (Purple)
<VerificationBadge type="human" size={20} />

// Dragverse Team Member (Pink)
<VerificationBadge type="team" size={20} />
```

### Badge Types

- **Creator** (#CDB531 - Gold): For verified content creators
- **Human** (#815BFF - Purple): For verified human users (not bots)
- **Team** (#E748E6 - Pink): For official Dragverse team members

## Chocolate Bar Tipping System

Replace traditional currency symbols with chocolate bars for a fun, engaging tipping experience.

### Usage

```tsx
import { ChocolateBar, ChocolateBarAmount } from "@/components/ui/chocolate-bar";

// Single chocolate bar (filled or outlined)
<ChocolateBar size={24} filled={true} />
<ChocolateBar size={24} filled={false} />

// Display an amount (1 USDC = 1 chocolate bar)
<ChocolateBarAmount amount={3} size={20} showCount={true} />
<ChocolateBarAmount amount={12.5} size={20} showCount={true} />
```

### Conversion

- 1 USD/USDC = 1 full chocolate bar
- Displays up to 5 bars visually, then shows numeric count
- Partial amounts shown with outlined bar + decimal

## Ownership Banner

A dismissible banner that appears to remind users they own their wallet and content.

### Features

- Appears after 2 seconds on first visit
- Can be dismissed permanently (stored in localStorage)
- Can be dismissed temporarily ("Later" button)
- Links to the Technology & Ethics page
- Animated slide-up entrance

### Location

Automatically included in the platform layout at `/app/(platform)/layout.tsx`

### Customization

The banner uses localStorage key `ownership-banner-dismissed` to track dismissal state.

## Example: Complete User Card

```tsx
import { VerificationBadge } from "@/components/ui/verification-badge";
import { ChocolateBarAmount } from "@/components/ui/chocolate-bar";
import Image from "next/image";

function UserCard({ user }) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar with verification badge */}
      <div className="relative">
        <Image
          src={user.avatar}
          width={48}
          height={48}
          className="rounded-full"
          alt={user.name}
        />
        <div className="absolute -bottom-1 -right-1">
          <VerificationBadge type={user.verificationType} size={18} />
        </div>
      </div>

      {/* User info */}
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{user.name}</h3>
        </div>

        {/* Tips received */}
        <div className="flex items-center gap-1 text-sm text-gray-400">
          <span>Received:</span>
          <ChocolateBarAmount amount={user.tipsReceived} size={16} />
        </div>
      </div>
    </div>
  );
}
```

## Blockchain Ownership Message

Users are reminded that:
- Their wallet belongs to them
- Their content is on the blockchain
- They can leave at any time with all their assets
- No platform lock-in or gatekeepers

This messaging reinforces Dragverse's commitment to decentralization and user ownership.
