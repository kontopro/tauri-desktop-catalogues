import { useState } from 'react';
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient';
import Subnav from '@/components/Subnav';


export default function Home( { allParts } ) {

    const [search, setSearch] = useState('')

    const handleChange = (event) => {
    event.preventDefault();
    const curr = event.target.value;
    setSearch(curr);
    // console.log(allParts);
  }

    return (
    <main className='main'>
          <Subnav printbtn={false} aithshbtn={false} txt={`Αναζήτηση`} /> 
         <div className='search-wrapper'>
          <div className='search-title'>
          <p>Αναζητήστε Αριθμό Ονομαστικού ή Part Number</p>
          </div>
         <form className='search-form'>
          <input type='text' onChange={handleChange} placeholder='Πληκτρολογείστε τουλάχιστον 5 χαρακτήρες' name='ao'/>
        </form>
          </div>
          <div className="form-listnsn">
          {search.length>4?
                <table>
                <thead>
                    <tr>
                        <th>Α/Ο</th>
                        <th>P/N</th>
                        <th>ΠΕΡΙΓΡΑΦΗ</th>
                        <th>ΚΥΡΙΟ ΥΛΙΚΟ</th>
                        <th>ΚΑΤΑΛΟΓΟΣ</th>
                        <th>ΥΠΟΣΥΓΚΡΟΤΗΜΑ</th>
                    </tr>
                </thead>
                <tbody>
                {allParts.filter(y => y.nsn && y.pn?y.nsn.includes(search) || y.pn.includes(search):y.nsn?y.nsn.includes(search):y.pn?y.pn.includes(search):0).map(x => <tr key={x.id}>
                  <td>{x.nsn}</td>
                  <td>{x.pn}</td>                
                  <td>{x.name}</td>
                  <td>{x.assembly?x.assembly.catalogue.kyrio.name:''}</td>
                  <td>{x.assembly?x.assembly.catalogue.name:''}</td>
                  <td><Link href={`${x.assembly.catalogue.kyrio.category.slug}/${x.assembly.catalogue.kyrio.slug}/${x.assembly.catalogue.slug}/tree`}>{x.picture_no} &#8618;</Link></td>
                  </tr>)}
                </tbody>
                </table>
:''}
        </div>
    </main>
  )
}

export async function getStaticProps()  {
  
  const { data: allParts, error } = await supabase.from('part').select('id,ref_no,picture_no,name,nsn,pn,assembly(id,assid,parent_assid, catalogue(id,name,slug, kyrio(id,name,slug,category(id,slug))))');
  // 
  
  return {
    props: {
        allParts,
    }
  }    
}


