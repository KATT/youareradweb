import Stripe from 'stripe'

export const createNewDonation = async (event: Stripe.DiscriminatedEvent) => {
  if (event.type === 'checkout.session.completed') {
    await prisma.donation.create({
      data: {
        name: event.data.object.customer_details?.name,
        email: event.data.object.customer_details?.email,
        amount: event.data.object.amount_total
          ? Math.floor(event.data.object.amount_total / 100)
          : 0,
        customer_id: event.data.object.id,
        payment_method: 'STRIPE',
        payment_status: 'SUCCESS',
        payment_type: event.data.object.mode === 'payment' ? 'ONETIME' : 'MONTHLY',
        User: {
          connectOrCreate: {
            where: {
              email: event.data.object.customer_details?.email as string,
            },
            create: {
              name: event.data.object.customer_details?.name,
              email: event.data.object.customer_details?.email,
              is_monthly: event.data.object.mode === 'subscription',
              newsletter: true,
            },
          },
        },
      },
    })
  }
}
