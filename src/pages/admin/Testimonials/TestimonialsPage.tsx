import { AdminShell } from '../../../components/admin/AdminShell'

const testimonials = [
  {
    name: 'Alex',
    relationship: 'Colleague',
    text: 'Reliable engineer who communicates clearly and follows through.',
  },
  {
    name: 'Jamie',
    relationship: 'Volunteer teammate',
    text: 'Thoughtful, collaborative, and proactive when solving problems.',
  },
]

export function TestimonialsPage() {
  return (
    <AdminShell
      route="/admin/testimonials"
      title="Testimonials"
      responsiveTitle="Testimonial Management"
      intro="Review submitted testimonials before deciding whether they should be published."
    >
      <div className="testimonial-tabs" role="group" aria-label="Testimonial status filters">
        <button className="testimonial-tab testimonial-tab--active" type="button" aria-pressed="true">
          Pending (2)
        </button>
        <button className="testimonial-tab" type="button" aria-pressed="false">
          Approved (6)
        </button>
        <button className="testimonial-tab" type="button" aria-pressed="false">
          Rejected (1)
        </button>
      </div>

      <section className="testimonial-list" aria-label="Pending testimonials">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.name}>
            <h2>{testimonial.name} — {testimonial.relationship}</h2>
            <p>{testimonial.text}</p>
            <div className="testimonial-actions" aria-label={`Review ${testimonial.name}'s testimonial`}>
              <button className="testimonial-action testimonial-action--approve" type="button">Approve</button>
              <button className="testimonial-action testimonial-action--reject" type="button">Reject</button>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  )
}
