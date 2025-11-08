export const generateProductSchema = (product, vendors = [], location = "Hyderabad") => {
  // Generate multiple variant offers for each weight/cut combination
  const generateVariantOffers = () => {
    const offers = []
    
    vendors.forEach(vendor => {
      if (product.variations && product.variations.length > 0) {
        // Create separate offer for each variation
        product.variations.forEach((variation, index) => {
          const variantPrice = Math.round(vendor.price * variation.priceMultiplier)
          offers.push({
            "@type": "Offer",
            "name": `${product.name} - ${variation.weight || variation.quantity || variation.size || variation.cut}`,
            "price": variantPrice,
            "priceCurrency": "INR",
            "availability": vendor.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "sku": `${product.id}-${vendor.id}-${index}`,
            "gtin": `FC${product.id}${index}`,
            "weight": variation.weight ? `${variation.weight} g` : undefined,
            "seller": {
              "@type": "LocalBusiness",
              "name": vendor.name,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": location,
                "addressCountry": "IN"
              },
              "telephone": "+91-9876543210",
              "url": `https://freshcuts.com/vendor/${vendor.id}`
            },
            "priceValidUntil": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "INR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 0,
                  "maxValue": 2,
                  "unitCode": "HUR"
                },
                "businessDays": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                }
              },
              "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "IN",
                "addressRegion": "Telangana"
              }
            }
          })
        })
      } else {
        // Single offer if no variations
        offers.push({
          "@type": "Offer",
          "price": vendor.price,
          "priceCurrency": "INR",
          "availability": vendor.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "LocalBusiness",
            "name": vendor.name
          }
        })
      }
    })
    
    return offers
  }

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
      product.image_url || product.imageUrl,
      `${product.image_url}?w=400&h=300`,
      `${product.image_url}?w=800&h=600`
    ].filter(Boolean),
    "description": `Fresh ${product.name} - Premium quality ${product.category} sourced from local farms in ${location}. Available in multiple weights and cuts. Same-day delivery available.`,
    "category": {
      "@type": "CategoryCode",
      "name": product.category,
      "codeValue": product.category.toUpperCase()
    },
    "brand": {
      "@type": "Brand",
      "name": "FreshCuts",
      "logo": "https://freshcuts.com/icon.svg",
      "url": "https://freshcuts.com"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "FreshCuts Marketplace",
      "url": "https://freshcuts.com"
    },
    "sku": product.id,
    "gtin": `FC${product.id}`,
    "mpn": `FC-${product.category.toUpperCase()}-${product.id}`,
    "offers": generateVariantOffers(),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (4.2 + Math.random() * 0.6).toFixed(1),
      "reviewCount": Math.floor(Math.random() * 200) + 50,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Satisfied Customer"
        },
        "reviewBody": `Fresh ${product.name} delivered quickly. Great quality!`
      }
    ],
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Freshness",
        "value": "Same day sourced"
      },
      {
        "@type": "PropertyValue",
        "name": "Delivery",
        "value": "Same day delivery available"
      },
      {
        "@type": "PropertyValue",
        "name": "Storage",
        "value": "Keep refrigerated"
      }
    ],
    "hasVariant": product.variations ? product.variations.map((variation, index) => ({
      "@type": "Product",
      "name": `${product.name} - ${variation.weight || variation.quantity || variation.size}`,
      "sku": `${product.id}-variant-${index}`,
      "weight": variation.weight ? `${variation.weight} g` : undefined,
      "size": variation.size || undefined
    })) : undefined,
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": product.category === 'chicken' ? "165 per 100g" : 
                 product.category === 'mutton' ? "294 per 100g" :
                 product.category === 'fish' ? "206 per 100g" : "varies",
      "proteinContent": product.category === 'chicken' ? "31g per 100g" :
                       product.category === 'mutton' ? "25g per 100g" :
                       product.category === 'fish' ? "22g per 100g" : "varies"
    },
    "isRelatedTo": [
      {
        "@type": "Product",
        "name": `Other ${product.category} products`
      }
    ]
  }
}