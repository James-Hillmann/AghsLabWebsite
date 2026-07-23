import {
  ITEM_CATEGORY_COLOR,
  QUALITY_COLOR,
  formatItemValue,
  itemIconUrl,
  type Item,
} from '@/lib/items'

import { CatalogueIcon } from './CatalogueIcon'
import { RichText } from './RichText'

/**
 * One item in the list.
 *
 * Like a relic, an item leads with what it does rather than its art -- the whole reason to buy
 * one is the text -- so this is a card, not a tile. Unlike a relic it has no rolled range: an
 * item's numbers are fixed, so the stat block is a flat list, and the gold cost, cooldown and
 * rarity ride along as small tags because those are what you weigh a purchase on.
 *
 * There's no detail route to open, so the card is a plain block; the browser dims the rest
 * while you search rather than filtering, matching the other catalogues.
 */
export function ItemCard({ item, isDimmed = false }: { item: Item; isDimmed?: boolean }) {
  const accent = ITEM_CATEGORY_COLOR[item.category]
  const quality = item.quality ? QUALITY_COLOR[item.quality] ?? '#8aa4b8' : undefined

  return (
    <div
      data-dimmed={isDimmed || undefined}
      className={`shard shard-edge block bg-[color-mix(in_srgb,var(--ice-deep)_45%,transparent)] px-5 py-4 transition-opacity duration-200 ${
        isDimmed ? 'opacity-25 hover:opacity-100 focus-within:opacity-100' : ''
      }`}
      style={{ '--cut': '10px' } as React.CSSProperties}
    >
      <div className="flex gap-3.5">
        <CatalogueIcon
          src={itemIconUrl(item)}
          accent={accent}
          size={128}
          className="shard size-11 shrink-0 object-contain"
          fallbackClassName="shard size-11 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-x-2.5 gap-y-1">
            <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight text-frost">
              {item.name}
            </h3>
            {item.quality && (
              <span className="label text-[0.5rem]" style={{ color: quality }}>
                {item.quality}
              </span>
            )}
            {item.cost ? (
              <span className="ml-auto font-[family-name:var(--font-label)] text-sm tabular-nums text-[#e8c56a]">
                {item.cost.toLocaleString()}g
              </span>
            ) : null}
          </div>

          {item.description && (
            <div className="mt-1.5 text-sm leading-relaxed text-muted">
              <RichText text={item.description} />
            </div>
          )}

          {item.note && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted/70">
              <RichText text={item.note} />
            </p>
          )}
        </div>
      </div>

      {item.values.length > 0 && (
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
          {item.values.map((value) => (
            <div key={value.key} className="flex items-baseline gap-2">
              <dt className="label text-[0.5rem] text-muted">{value.name}</dt>
              <dd className="font-[family-name:var(--font-label)] text-xs tabular-nums text-frost">
                {formatItemValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {(item.cooldown || item.manaCost || item.stock) && (
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--edge)] pt-2.5">
          {item.cooldown ? (
            <span className="label text-[0.5rem] text-muted">
              Cooldown <span className="text-frost tabular-nums">{item.cooldown}s</span>
            </span>
          ) : null}
          {item.manaCost ? (
            <span className="label text-[0.5rem] text-muted">
              Mana <span className="text-frost tabular-nums">{item.manaCost}</span>
            </span>
          ) : null}
          {item.stock ? (
            <span className="label text-[0.5rem] text-muted">
              Stock <span className="text-frost tabular-nums">{item.stock}</span>
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
