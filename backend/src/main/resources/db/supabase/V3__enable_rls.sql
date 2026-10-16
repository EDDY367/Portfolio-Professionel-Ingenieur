-- Supabase expose automatiquement le schema public via PostgREST (cle anon).
-- Le portfolio n'est accessible QUE via l'API Spring Boot : on active la RLS sans aucune policy,
-- ce qui bloque tout acces direct avec la cle anon. Spring Boot se connecte avec le role
-- proprietaire (postgres), qui contourne la RLS.

ALTER TABLE admin_users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences    ENABLE ROW LEVEL SECURITY;
ALTER TABLE educations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
