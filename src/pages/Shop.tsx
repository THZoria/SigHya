import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Gamepad2, ShoppingBag, Sparkles, Tag, type LucideIcon } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useI18n } from '../i18n/context'

const PARTNER_TAG = 'sighya-21'

type AffiliateProduct = {
  name: string
  price: string
  image: string
  url: string
  subtitle?: string
}

type AffiliateCategory = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  badge: string
  badgeColor: string
  products: AffiliateProduct[]
}

const normalizeAmazonUrl = (url: string, tag = PARTNER_TAG) => {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'amzn.to') {
      return url
    }

    if (parsed.hostname.includes('amazon.')) {
      parsed.searchParams.set('tag', tag)
      return parsed.toString()
    }

    return url
  } catch {
    return url
  }
}

const featuredProducts: AffiliateProduct[] = [
  {
    name: 'SanDisk 128 Go Ultra microSDXC + adaptateur SD',
    price: '24,99 EUR',
    image: 'https://m.media-amazon.com/images/I/71HEG21YF1L._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/SanDisk-Extreme-RescuePRO-Deluxe-jusqu%C3%A0/dp/B0B7NTY2S6?dib=eyJ2IjoiMSJ9.wURXrQCPkQt61NVEdL51J3jafeSYK1gQPLPZLzfs1zjjlaBf10Ks6eKk6Ph5pu5AFvKqSkGz4N4l3Rau-m71MsLLG_pJ1gTwlfD4WUHFEFGcQMgCJLWfFLs0oeT7A6smjFxlklzBU5hxMjdE7b9p_IyVWbODiyHivs4jWkpnlpyH_NFk6bj6NfuhJzn_OAgVTdC5GQE1P8X9eOScsrRdGj3NOCYAoBGpgPrUxWr-3JX8vM8LfDGRbd2UvsdYguFll7xQsk_51-S-K1p4-dh9WbVWnDhKJQsjgmgEcOKxs4w.--QkAxImXHIbNpvGOjp0kre3hya498RCw74JXFZ3aNQ&dib_tag=se&keywords=carte%2Bsd%2B128&qid=1781205830&sr=8-6&ufe=app_do%3Aamzn1.fos.145a8e13-1922-4297-a24d-122ee7150418&th=1&linkCode=sl2&tag=sighya-21&linkId=333fabd6cc608a54e6619c409c47f89a&ref_=as_li_ss_tl',
  },
  {
    name: 'SanDisk Ultra microSDXC 256 Go + adaptateur SD',
    price: '42,99 EUR',
    image: 'https://m.media-amazon.com/images/I/71-zZvfSByL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0B7NV73PJ',
  },
  {
    name: 'Acer Lecteur de carte SD USB-C / USB 3.0',
    price: '10,99 EUR',
    image: 'https://m.media-amazon.com/images/I/61qT3xFVtzL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0DQ71G4G4',
  },
]

const switchPreorders: AffiliateProduct[] = [
  {
    name: 'Lies of P: Complete Edition - Switch 2',
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/61w2OruRGKL._AC_SL1000_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4NYGBFG?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=2ff69ee0cd81809df5fedf3760e6b4ba&ref_=as_li_ss_tl',
  },
  {
    name: 'DRAGON QUEST MONSTERS: Le royaume de Boisfletri (Switch 2)',
    price: '59,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81C9LuZv-yL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4RSX6ZH?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=d9608f326d9942f40f1fd886446c701a&ref_=as_li_ss_tl',
  },
  {
    name: 'Tales of Eternia Remastered (Switch 2)',
    price: '29,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81BND-WwpyL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4RVSZG3?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=c27ca31435207b2633a8ac269809be18&ref_=as_li_ss_tl',
  },
  {
    name: 'FINAL FANTASY RESONANCE (Switch 2)',
    price: '59,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81o1HH-eGUL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4RZMR85?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=d9375c97facc422a859d25859361c512&ref_=as_li_ss_tl',
  },
  {
    name: 'Xenoblade Chronicles: Definitive Edition - Nintendo Switch 2 Edition',
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81FD6ZrAaFL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4R6165N?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=472259e50a620c00fc7a658f664750cf&ref_=as_li_ss_tl',
  },
  {
    name: 'Xenoblade Chronicles 2 - Nintendo Switch 2 Edition',
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81+5ibdSc6L._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4R87MXW?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=f265dd45a8aa31e433fe77bef5c0533e&ref_=as_li_ss_tl',
  },
  {
    name: 'Xenoblade Chronicles 3 - Nintendo Switch 2 Edition',
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81wm6S2L8vL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4RDYZWX?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=ffe6347fc41fac23d92f4f5ec48975b1&ref_=as_li_ss_tl',
  },
  {
    name: 'Orbitals',
    price: '39,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81BiYzye5UL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4R1TPC5?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=3d4de8b68d853637226864f58f07a3fd&ref_=as_li_ss_tl',
  },
  {
    name: 'Nintendo Switch Sports Resort',
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81f1xUWhpgL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4R2RNBY?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=55a8855816915e0a666f67ba528ba07c&ref_=as_li_ss_tl',
  },
  {
    name: "Fire Emblem: Fortune's Weave",
    price: '69,99 EUR',
    image: 'https://m.media-amazon.com/images/I/91RAJ0+jEnL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H4R99Z9Y?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=c0cb8954333a97dd95d1fc19d6051469&ref_=as_li_ss_tl',
  },
  {
    name: 'Hot Wheels Infinite Rush - Standard Edition (NSW2)',
    price: '49,99 EUR',
    image: 'https://m.media-amazon.com/images/I/81psFe-2dCL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H46FV813?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=e4ea73adaf1974a3eaf9fdd04623b20c&ref_=as_li_ss_tl',
  },
  {
    name: 'Hollow Knight - Switch 2',
    price: '44,99 EUR',
    image: 'https://m.media-amazon.com/images/I/7152i9m6jsL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H3428TWD?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=6f4678626d6416fe51fc225ca30d2b41&ref_=as_li_ss_tl',
  },
  {
    name: 'Hollow Knight: Silksong - Switch 2',
    price: '49,99 EUR',
    image: 'https://m.media-amazon.com/images/I/71VIZBr9DjL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0H33VW37Y?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=fa998cb8b6d991d5ae456d5fb159c16d&ref_=as_li_ss_tl',
  },
  {
    name: 'Legendes Pokemon : Z-A - Nintendo Switch 2 Edition',
    price: '41,39 EUR',
    image: 'https://m.media-amazon.com/images/I/81mqqsm2yZL._AC_SL1500_.jpg',
    url: 'https://www.amazon.fr/dp/B0FGDR5TSL?th=1&psc=1&smid=A1X6FK5RDHNB96&linkCode=sl2&tag=sighya-21&linkId=3239feecd264c646fe34514610f3e64d&ref_=as_li_ss_tl',
  },
]

const Shop = () => {
  const { t } = useI18n()
  const [releasedSwitchGames, setReleasedSwitchGames] = useState<AffiliateProduct[]>([])
  const [loadingReleasedGames, setLoadingReleasedGames] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadReleasedGames = async () => {
      try {
        const response = await fetch('/switch-released.json')
        const data = (await response.json()) as AffiliateProduct[]

        if (isMounted) {
          setReleasedSwitchGames(data)
        }
      } catch {
        if (isMounted) {
          setReleasedSwitchGames([])
        }
      } finally {
        if (isMounted) {
          setLoadingReleasedGames(false)
        }
      }
    }

    void loadReleasedGames()

    return () => {
      isMounted = false
    }
  }, [])

  const affiliateCategories = useMemo<AffiliateCategory[]>(
    () => [
      {
        id: 'accessoires',
        title: t('shop.categories.accessories.title'),
        description: t('shop.categories.accessories.description'),
        icon: ShoppingBag,
        badge: t('shop.badges.deals'),
        badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-400/20',
        products: featuredProducts,
      },
      {
        id: 'precommandes-switch',
        title: t('shop.categories.preorders.title'),
        description: t('shop.categories.preorders.description'),
        icon: Sparkles,
        badge: t('shop.badges.preorder'),
        badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-400/20',
        products: switchPreorders,
      },
      {
        id: 'jeux-switch',
        title: t('shop.categories.released.title'),
        description: t('shop.categories.released.description'),
        icon: Gamepad2,
        badge: t('shop.badges.released'),
        badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20',
        products: releasedSwitchGames,
      },
    ],
    [releasedSwitchGames, t],
  )

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-200 text-sm mb-6">
              <ShoppingBag className="w-4 h-4" />
              {t('shop.hero.eyebrow')}
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-200 via-orange-200 to-blue-300 text-transparent bg-clip-text mb-6">
              {t('shop.hero.title')}
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t('shop.hero.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {affiliateCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-2xl border border-blue-500/15 bg-gray-800/70 p-5 text-left hover:border-blue-400/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${category.badgeColor}`}>
                    <category.icon className="w-4 h-4" />
                    {category.badge}
                  </div>
                  <span className="text-sm text-gray-400">
                    {category.products.length}{' '}
                    {category.products.length > 1
                      ? t('shop.actions.productsPlural')
                      : t('shop.actions.productSingular')}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{category.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{category.description}</p>
              </a>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 sm:p-5 text-sm text-emerald-100">
            {t('shop.highlight.prefix')}{' '}
            <span className="font-semibold text-white">
              {t('shop.categories.released.title')}
            </span>{' '}
            {t('shop.highlight.suffix')}
          </div>

          {affiliateCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-28 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                  <p className="text-gray-300 mt-2 max-w-3xl">{category.description}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium self-start ${category.badgeColor}`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.badge}
                </div>
              </div>

              {category.id === 'jeux-switch' && loadingReleasedGames ? (
                <div className="rounded-2xl border border-dashed border-emerald-400/25 bg-emerald-500/5 p-6 text-emerald-100">
                  {t('shop.states.loading')}
                </div>
              ) : category.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {category.products.map((product, productIndex) => (
                    <motion.article
                      key={`${category.id}-${product.name}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: productIndex * 0.03 }}
                      className="group overflow-hidden rounded-2xl border border-blue-500/15 bg-gray-800/75 backdrop-blur-sm hover:border-blue-400/40 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] transition-all duration-500 hover:-translate-y-1"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-900">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${category.badgeColor}`}
                          >
                            <Tag className="w-3.5 h-3.5" />
                            {category.badge}
                          </span>
                          <span className="text-lg font-bold text-emerald-300 whitespace-nowrap">
                            {product.price}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-white leading-snug min-h-[3.5rem]">
                            {product.name}
                          </h3>
                          {category.id === 'jeux-switch' || product.subtitle ? (
                            <p className="text-sm text-gray-400">
                              {category.id === 'jeux-switch'
                                ? t('shop.products.weeklyTop')
                                : product.subtitle}
                            </p>
                          ) : null}
                        </div>

                        <a
                          href={normalizeAmazonUrl(product.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:from-blue-400 hover:to-cyan-400 transition-all duration-300"
                        >
                          {t('shop.actions.viewOnAmazon')}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-emerald-400/25 bg-emerald-500/5 p-6 text-emerald-100">
                  {t('shop.states.empty')}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

export default Shop
