import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') ? { rejectUnauthorized: false } : false
});

const migrationSQL = `
-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  author VARCHAR(255) DEFAULT 'Admin',
  category VARCHAR(100),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  views_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features Table
CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Plans Table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2),
  billing_period VARCHAR(50) DEFAULT 'monthly',
  description TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- How It Works Steps Table
CREATE TABLE IF NOT EXISTS how_it_works (
  id SERIAL PRIMARY KEY,
  step_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Who It's For Table
CREATE TABLE IF NOT EXISTS who_its_for (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(100),
  target_audience VARCHAR(100),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reunited Stories Table
CREATE TABLE IF NOT EXISTS reunited_stories (
  id SERIAL PRIMARY KEY,
  pet_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  pet_type VARCHAR(100),
  breed VARCHAR(100),
  story_title VARCHAR(255) NOT NULL,
  story_content TEXT NOT NULL,
  before_image_url VARCHAR(500),
  after_image_url VARCHAR(500),
  lost_date DATE,
  found_date DATE,
  days_lost INT,
  featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO blogs (title, slug, excerpt, content, category, author) VALUES
('Finding Your Lost Pet: A Guide', 'finding-lost-pet-guide', 'Learn the best practices for finding your lost pet.', 'This comprehensive guide covers the essential steps to take when your pet goes missing...', 'Guides', 'Admin'),
('Pet Safety Tips During Holidays', 'pet-safety-holidays', 'Keep your pet safe during holiday season.', 'Holiday time is exciting but can be dangerous for pets. Here are key safety tips...', 'Safety', 'Admin'),
('Technology in Pet Reunification', 'tech-pet-reunification', 'How modern tech helps reunite pets with families.', 'Modern technology has revolutionized how we find lost pets...', 'Technology', 'Admin');

INSERT INTO faqs (question, answer, category) VALUES
('How does Fur Finder work?', 'Fur Finder helps reunite lost pets with their owners by listing lost and found pets in your area.', 'General'),
('Is it free to use?', 'Yes, Fur Finder is completely free to use for all pet owners.', 'Pricing'),
('How quickly can I post a lost pet?', 'You can post a lost pet in under a minute with our simple form.', 'Getting Started'),
('What information do I need to post?', 'You''ll need a photo, pet description, location, and contact information.', 'Getting Started'),
('Can I edit my post later?', 'Yes, you can edit or delete your post anytime from your account.', 'General');

INSERT INTO features (title, description, icon_name, display_order) VALUES
('Quick Pet Listing', 'Post your lost or found pet in seconds with our simple form.', 'lightning', 1),
('Location-Based Search', 'Find pets near you with our advanced location filtering.', 'map-pin', 2),
('Real-Time Notifications', 'Get instant alerts when matching pets are posted in your area.', 'bell', 3),
('Verified Profiles', 'Connect with trusted pet owners and rescuers in your community.', 'check-circle', 4),
('Community Support', 'Join a caring community dedicated to helping pets find their way home.', 'users', 5),
('Mobile Friendly', 'Access Fur Finder on any device, anytime, anywhere.', 'smartphone', 6);

INSERT INTO pricing_plans (name, price, description, is_popular, display_order) VALUES
('Free Plan', 0, 'For individual pet owners looking to reunite with lost pets', FALSE, 1),
('Premium Plan', 9.99, 'Enhanced features for power users and pet organizations', TRUE, 2),
('Business Plan', 29.99, 'For shelters, rescues, and pet businesses', FALSE, 3);

INSERT INTO how_it_works (step_number, title, description, display_order) VALUES
(1, 'Post Your Pet', 'Create a detailed listing with photos and description of your lost or found pet.', 1),
(2, 'Share Across Network', 'Your pet listing is shared with the entire Fur Finder community.', 2),
(3, 'Get Matched', 'Our system matches lost and found pets based on description and location.', 3),
(4, 'Reunite & Celebrate', 'Connect with the person who found or lost your pet and reunite!', 4);

INSERT INTO who_its_for (title, description, target_audience, display_order) VALUES
('Pet Owners', 'If you have lost a beloved pet, we help you find them quickly and safely.', 'Pet Owners', 1),
('Finders', 'Found a lost pet? Help reunite them with their worried family.', 'Finders', 2),
('Pet Rescues', 'Rescue organizations can use Fur Finder to help lost animals find their way home.', 'Rescues', 3),
('Veterinarians', 'Vets can help coordinate lost pet reunifications with their community.', 'Vets', 4);

INSERT INTO reunited_stories (pet_name, owner_name, pet_type, breed, story_title, story_content, lost_date, found_date, days_lost, featured) VALUES
('Max', 'John Smith', 'Dog', 'Golden Retriever', 'Max Found After 3 Days!', 'Max got loose during a family outing at the park. Thanks to Fur Finder, a kind stranger found him and contacted us through the app. We were reunited within 3 days!', '2024-01-15', '2024-01-18', 3, TRUE),
('Whiskers', 'Sarah Johnson', 'Cat', 'Tabby', 'Whiskers Came Home', 'Our cat Whiskers disappeared during a thunderstorm. We posted on Fur Finder and within hours, our neighbor found her hiding in their garage. She''s back home and safe!', '2024-02-01', '2024-02-02', 1, TRUE),
('Luna', 'Mike Chen', 'Dog', 'Husky', 'Luna''s Adventure', 'Luna, our 2-year-old Husky, escaped from our yard. Using Fur Finder, we were able to locate her within 24 hours. She''d walked nearly a mile away from home!', '2024-02-10', '2024-02-11', 1, FALSE);
`;

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Starting database migration...');
    await client.query(migrationSQL);
    console.log('✓ Migration completed successfully!');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
