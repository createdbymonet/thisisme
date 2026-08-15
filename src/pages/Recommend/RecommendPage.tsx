import { StandalonePage } from '../../components/layout/StandalonePage'

export function RecommendPage() {
  return (
    <StandalonePage className="recommend-page" route="/recommend" title="Testimonial Submission" intro="A future submission page for colleagues, managers, engineers, and volunteer teammates. Submitted testimonials will require admin approval before publication.">
      <form className="recommend-form">
        <label className="visually-hidden" htmlFor="display-name">Display name</label>
        <input id="display-name" name="displayName" type="text" placeholder="Display name" />
        <label className="visually-hidden" htmlFor="relationship">Relationship</label>
        <input id="relationship" name="relationship" type="text" placeholder="Relationship" />
        <label className="visually-hidden" htmlFor="testimonial">Testimonial / recommendation</label>
        <textarea id="testimonial" name="testimonial" placeholder="Testimonial / recommendation" />
        <label className="visually-hidden" htmlFor="name-preference">Name display preference</label>
        <input id="name-preference" name="namePreference" type="text" placeholder="Name display preference" />
        <button className="button button--accent recommend-form__submit" type="button">Submit testimonial</button>
      </form>
    </StandalonePage>
  )
}
