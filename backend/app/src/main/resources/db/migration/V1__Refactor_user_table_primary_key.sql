-- Migration to refactor user table primary key structure
-- This ensures the primary key column is named 'id' (not 'user_id')

-- Check if the table structure needs refactoring
DO $$
BEGIN
    -- If user_id column exists and id doesn't exist, rename user_id to id
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'user_id') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'users' AND column_name = 'id') THEN
        
        -- Drop foreign key constraints first
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'user_verifications' 
                   AND constraint_type = 'FOREIGN KEY') THEN
            ALTER TABLE user_verifications DROP CONSTRAINT IF EXISTS fk_user_verifications_user_id;
        END IF;
        
        -- Rename the column
        ALTER TABLE users RENAME COLUMN user_id TO id;
        
        -- Recreate foreign key constraint with new column name
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_verifications') THEN
            ALTER TABLE user_verifications 
            ADD CONSTRAINT fk_user_verifications_user_id 
            FOREIGN KEY (user_id) REFERENCES users(id);
        END IF;
        
    -- If both columns exist (unexpected case), drop user_id and keep id
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'user_id') 
          AND EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'users' AND column_name = 'id') THEN
        
        -- Update any references to user_id to use id instead
        UPDATE users SET id = user_id WHERE id IS NULL OR id = '';
        
        -- Drop the redundant user_id column
        ALTER TABLE users DROP COLUMN IF EXISTS user_id;
        
    END IF;
    
    -- Ensure proper constraints on the id column
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'id') THEN
        
        -- Ensure id is primary key
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                       WHERE table_name = 'users' 
                       AND constraint_type = 'PRIMARY KEY') THEN
            ALTER TABLE users ADD PRIMARY KEY (id);
        END IF;
        
        -- Ensure id is not null
        ALTER TABLE users ALTER COLUMN id SET NOT NULL;
        
    END IF;
    
END $$;