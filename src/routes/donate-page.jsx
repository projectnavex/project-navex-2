export default function DonatePage() {
  return (
    <div className="mx-auto mt-8 md:w-4/5 lg:w-2/5">
      <h2 className="mb-4 text-center font-bold">Support Us By Donating</h2>
      <p className="mb-4">
        Thank you for using Project Navex! We built this website for fun but
        unfortunately, by using Google Maps API, we are incurring costs. Every
        time a user clicks on the map, or presses the run button, we lose money.
        We wanted to make this website free and accessible to NSFs or NSmen. But
        to keep it running without losing money, we hope that you can help us by
        donating.
      </p>
      <p>
        We have been through the pain of spending hours on our NDS right before
        an upcoming outfield, and we hope our website has helped to alleviate
        that pain. If you wish to donate, please do so through the Paynow QR
        code below. Any amount would be appreciated!
      </p>
      <img
        src="./src/assets/paynow.png"
        alt="paynow"
        className="mx-auto mt-10 h-40 w-40"
      />
    </div>
  );
}
