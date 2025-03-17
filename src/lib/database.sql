
-- Tạo bảng users (sử dụng bảng auth.users của Supabase với thêm các trường bổ sung)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Trigger để tự động tạo profile khi có user đăng ký
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

-- Tạo bảng folders
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Thêm RLS (Row Level Security) cho bảng folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders" 
  ON public.folders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders" 
  ON public.folders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
  ON public.folders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
  ON public.folders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Tạo bảng study_sets
CREATE TABLE public.study_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  folder_id UUID REFERENCES public.folders(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Thêm RLS cho bảng study_sets
ALTER TABLE public.study_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study sets" 
  ON public.study_sets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sets" 
  ON public.study_sets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sets" 
  ON public.study_sets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sets" 
  ON public.study_sets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Tạo bảng vocabularies
CREATE TABLE public.vocabularies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  study_set_id UUID REFERENCES public.study_sets(id) ON DELETE CASCADE NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Thêm RLS cho bảng vocabularies
ALTER TABLE public.vocabularies ENABLE ROW LEVEL SECURITY;

-- Vocabularies được kiểm soát bằng cách tham chiếu đến study_sets
CREATE POLICY "Users can view their own vocabularies" 
  ON public.vocabularies 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sets ss 
      WHERE ss.id = vocabularies.study_set_id AND ss.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own vocabularies" 
  ON public.vocabularies 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.study_sets ss 
      WHERE ss.id = vocabularies.study_set_id AND ss.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own vocabularies" 
  ON public.vocabularies 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sets ss 
      WHERE ss.id = vocabularies.study_set_id AND ss.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own vocabularies" 
  ON public.vocabularies 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.study_sets ss 
      WHERE ss.id = vocabularies.study_set_id AND ss.user_id = auth.uid()
    )
  );

-- Tạo view cho folder với count study sets
CREATE OR REPLACE VIEW public.folders_with_count AS
SELECT 
  f.id,
  f.user_id,
  f.name,
  f.description,
  f.created_at,
  COALESCE(COUNT(ss.id), 0)::integer AS study_set_count
FROM 
  public.folders f
LEFT JOIN 
  public.study_sets ss ON f.id = ss.folder_id
GROUP BY 
  f.id;

-- Tạo view cho study set với count vocabularies
CREATE OR REPLACE VIEW public.study_sets_with_count AS
SELECT 
  ss.id,
  ss.user_id,
  ss.folder_id,
  ss.name,
  ss.description,
  ss.created_at,
  COALESCE(COUNT(v.id), 0)::integer AS vocabulary_count
FROM 
  public.study_sets ss
LEFT JOIN 
  public.vocabularies v ON ss.id = v.study_set_id
GROUP BY 
  ss.id;

-- Cấp quyền cho authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.folders TO authenticated;
GRANT ALL ON public.study_sets TO authenticated;
GRANT ALL ON public.vocabularies TO authenticated;
GRANT SELECT ON public.folders_with_count TO authenticated;
GRANT SELECT ON public.study_sets_with_count TO authenticated;
