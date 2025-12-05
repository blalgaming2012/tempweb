const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto py-12 px-4 xl:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              About TempWeb
            </h3>
            <p className="text-muted-foreground">
              Professional web development services delivering high-quality HTML/CSS/JS websites tailored to your needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contact Information
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Email: contact@tempweb.com</p>
              <p>Support: Available 24/7</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Services
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Custom Website Development</p>
              <p>Responsive Design</p>
              <p>Website Maintenance</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>{currentYear} TempWeb</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
